import { IsUUID, Min } from 'class-validator';
import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class CreateLotteryRequestDto {
  @Min(1)
  @Field()
  numberOfBoards: number;

  @IsUUID()
  @Field()
  deckId: string;
}
