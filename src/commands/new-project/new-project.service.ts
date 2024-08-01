import * as fs from 'node:fs';
import * as path from 'node:path';
import { FileSystem } from 'common/file-system';
import { Injectable } from '@nestjs/common';
import { exec, execSync } from 'node:child_process';

interface NewProjectServiceOptions {
  rootDir: string;
  template: string;
  projectName: string;
}

@Injectable()
export class NewProjectService {
  async execute({ rootDir, template, projectName }: NewProjectServiceOptions) {
    const templateDir = path.resolve(
      __dirname,
      '../../..',
      'templates',
      template,
    );

    const filenames = fs.readdirSync(templateDir);
    for (const filename of filenames.filter((f) => f !== 'package.json')) {
      const targetPath = path.join(
        rootDir,
        filename === '_gitignore' ? '.gitignore' : filename,
      );

      FileSystem.copyFile(path.join(templateDir, filename), targetPath);
    }

    const pkg = JSON.parse(
      fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
    );

    pkg.name = this.toValidProjectName(projectName);

    const targetPath = path.join(rootDir, 'package.json');
    fs.writeFileSync(targetPath, JSON.stringify(pkg, null, 2) + '\n');

    execSync('npm install', {
      cwd: rootDir,
      stdio: 'inherit',
      encoding: 'utf-8',
    });
  }

  private toValidProjectName(projectName: string) {
    return projectName
      .split('/')
      .pop()!
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/^[._]/, '')
      .replace(/[^a-z\d\-~]+/g, '-');
  }
}
