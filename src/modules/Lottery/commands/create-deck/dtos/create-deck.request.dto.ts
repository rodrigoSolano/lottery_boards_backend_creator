import { MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDeckRequestDto {
  @Field()
  @MinLength(1)
  name: string;
}
