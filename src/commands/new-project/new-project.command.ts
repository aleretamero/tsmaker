import * as path from 'node:path';
import * as fs from 'node:fs';
import { Command, CommandRunner, Option } from 'nest-commander';
import { input, confirm, select } from '@inquirer/prompts';
import { FileSystem } from 'common/file-system';
import { NewProjectService } from './new-project.service';

interface NewProjectCommandOptions {
  packageManager?: string;
}

@Command({
  name: 'new',
  arguments: '<template> [name]',
  argsDescription: {
    template: 'The template to create the project from',
    name: 'The name of the project',
  },
  description: 'Create a new project from a template',
})
export class NewProjectCommand extends CommandRunner {
  constructor(private readonly newProjectService: NewProjectService) {
    super();
  }

  async run(
    inputs: string[],
    options?: NewProjectCommandOptions,
  ): Promise<void> {
    const template = inputs[0];
    let packageManager = options?.packageManager;

    const validTemplates = ['express'];
    if (!validTemplates.includes(template)) {
      console.error(
        `Invalid template: ${template}\n\n Available templates: ${validTemplates.join(', ')}`,
      );
      return;
    }

    const validPackageManagers = ['npm', 'yarn'];
    if (packageManager && !validPackageManagers.includes(packageManager)) {
      console.error(
        `Invalid package manager: ${packageManager}\n\n Available package managers: ${validPackageManagers.join(', ')}`,
      );
      return;
    }

    let rootDirname = inputs[1];

    if (rootDirname === undefined) {
      rootDirname = await this.questionProjectName();
    }

    if (!packageManager) {
      packageManager = await this.questionPackageManager();
    }

    const userCwd = process.cwd();
    const rootDir =
      rootDirname === '.' ? userCwd : path.join(userCwd, rootDirname);

    if (!fs.existsSync(rootDir)) {
      fs.mkdirSync(rootDir, { recursive: true });
    }

    if (
      !FileSystem.isEmptyDir(rootDir, {
        ignorePaths: ['.git', '.gitignore'],
      })
    ) {
      const overwrite = await this.overwrite(rootDir);
      if (!overwrite) {
        return;
      }
      FileSystem.clearDir(rootDir, {
        ignorePaths: ['.git', '.gitignore'],
      });
    }

    await this.newProjectService.execute({
      rootDir,
      template,
      projectName: path.basename(rootDir),
      packageManager,
    });
  }

  @Option({
    flags: '-pm, --package-manager <packageManager>',
    description: 'The package manager to use',
    choices: ['npm', 'yarn'],
  })
  parsePackageManager(value: string) {
    return value;
  }

  private async questionProjectName(): Promise<string> {
    return await input({
      message: 'Project name',
      validate: (value) => {
        if (!value?.trim()) {
          return 'Project name cannot be empty';
        }
        return true;
      },
    });
  }

  private async questionPackageManager(): Promise<string> {
    return await select({
      message: 'Select a package manager',
      choices: [
        {
          value: 'npm',
          name: 'npm',
        },
        {
          value: 'yarn',
          name: 'yarn',
        },
      ],
    });
  }

  private async overwrite(dir: string): Promise<boolean> {
    return await confirm({
      message:
        (dir === '.'
          ? 'The current directory'
          : `The target directory ${dir}`) +
        ' is not empty. Remove existing files and continue?',
    }).catch(() => {
      throw new Error('Overwrite cancelled!');
    });
  }
}
