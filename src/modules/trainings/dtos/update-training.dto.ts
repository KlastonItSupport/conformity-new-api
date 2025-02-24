import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingPayload } from './create-training-payload';

export class UpdateTraining extends PartialType(CreateTrainingPayload) {}
