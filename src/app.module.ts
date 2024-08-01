import { Module } from '@nestjs/common';
import { NewProjectModule } from 'commands/new-project/new-project.module';

@Module({
  imports: [NewProjectModule],
})
export class AppModule {}
