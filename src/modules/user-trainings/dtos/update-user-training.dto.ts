import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingUserDto } from './create-user-training.dto';

export class UpdateUserTraining extends PartialType(CreateTrainingUserDto) {}
