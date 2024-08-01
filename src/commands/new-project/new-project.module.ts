import { Module } from '@nestjs/common';
import { NewProjectService } from './new-project.service';
import { NewProjectCommand } from './new-project.command';

@Module({
  imports: [],
  controllers: [],
  providers: [NewProjectCommand, NewProjectService],
})
export class NewProjectModule {}
