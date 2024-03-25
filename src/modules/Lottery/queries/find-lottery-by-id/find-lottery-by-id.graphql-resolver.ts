import { Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

// DDD
import { Mapper } from '@src/libs/ddd';
import { PaginatedParams } from '@src/libs/ddd/query.base';

// Domain
import { LotteryEntity } from '../../domain/lottery.entity';

// Queries
import { FindLotteryByIdQuery } from './find-lottery-by-id.query-handler';

// DTOs
import { LotteryResponseDto } from '../../dtos/lottery.response.dto';

// Database models
import { LotteryModel } from '../../database/lottery.model';

// DI tokens
import { LOTTERY_MAPPER } from '../../di-tokens';

@Resolver()
export class FindLotteryByIdGraphqlResolver {
  constructor(
    @Inject(LOTTERY_MAPPER)
    protected readonly lotteryMapper: Mapper<LotteryEntity, LotteryModel>,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => LotteryResponseDto)
  async findLotteryById(
    @Args('id', { type: () => String })
    id: PaginatedParams<FindLotteryByIdQuery>,
  ): Promise<LotteryResponseDto> {
    const query = new FindLotteryByIdQuery({ id });

    const result: Result<LotteryEntity, Error> =
      await this.queryBus.execute(query);

    const response = result.unwrap();

    return this.lotteryMapper.toResponse(response);
  }
}
