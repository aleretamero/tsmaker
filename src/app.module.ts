import { Module } from '@nestjs/common';
import { NewCommand } from './commands/new/new.command';

@Module({
  imports: [],
  controllers: [],
  providers: [NewCommand],
})
export class AppModule {}
