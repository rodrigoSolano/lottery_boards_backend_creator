import { Result } from 'oxide.ts';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

// DD
import { AggregateID } from '@src/libs/ddd';

// DTOs
import { IdResponse } from '../../dtos/id.response.dto';
import { CreateLotteryRequestDto } from './dtos/create-lottery.request.dto';

// Commands
import { CreateLotteryCommand } from './create-lottery.command';

@Resolver()
export class CreateLotteryGraphqlResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => IdResponse)
  async createLottery(
    @Args('input') input: CreateLotteryRequestDto,
  ): Promise<IdResponse> {
    const command = new CreateLotteryCommand(input);

    const id: Result<AggregateID, Error> =
      await this.commandBus.execute(command);

    return new IdResponse(id.unwrap());
  }
}
