import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task-payload.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
