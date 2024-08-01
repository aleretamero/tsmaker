import { Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';

interface BasicCommandOptions {
  string?: string;
  boolean?: boolean;
  number?: number;
}

@Command({
  name: 'new',
  arguments: '<template>',
  argsDescription: {
    template: 'The template to create the project from',
  },
  description: 'Create a new project from a template',
})
export class NewCommand extends CommandRunner {
  async run(inputs: string[], options?: BasicCommandOptions): Promise<void> {
    const template = inputs[0];
    const validTemplates = ['express'];

    if (!validTemplates.includes(template)) {
      console.error(
        `Invalid template: ${template}\n\n Available templates: ${validTemplates.join(', ')}`,
      );
      return;
    }

    console.log(`Creating new project from template: ${template}`);
  }

  // @Option({
  //   flags: '--express [express]',
  //   description: 'A basic number parser',
  // })
  // parseNumber(val: string): number {
  //   return Number(val);
  // }

  // @Option({
  //   flags: '-n, --number [number]',
  //   description: 'A basic number parser',
  // })
  // parseNumber(val: string): number {
  //   return Number(val);
  // }

  // @Option({
  //   flags: '-s, --string [string]',
  //   description: 'A string return',
  // })
  // parseString(val: string): string {
  //   return val;
  // }

  // @Option({
  //   flags: '-b, --boolean [boolean]',
  //   description: 'A boolean parser',
  // })
  // parseBoolean(val: string): boolean {
  //   return JSON.parse(val);
  // }

  // runWithString(param: string[], option: string): void {
  //   console.log({ param, string: option });
  // }

  // runWithNumber(param: string[], option: number): void {
  //   console.log({ param, number: option });
  // }

  // runWithBoolean(param: string[], option: boolean): void {
  //   console.log({ param, boolean: option });
  // }

  // runWithNone(param: string[]): void {
  //   console.log({ param });
  // }
}
