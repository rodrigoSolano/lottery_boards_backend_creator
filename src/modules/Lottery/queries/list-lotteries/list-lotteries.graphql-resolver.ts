import { Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

// DDD
import { PaginatedParams } from '@src/libs/ddd/query.base';
import { Mapper, Paginated } from '@src/libs/ddd';

// Domain
import { CardEntity } from '../../domain/card.entity';
import { BoardEntity } from '../../domain/board.entity';
import { LotteryEntity } from '../../domain/lottery.entity';

// Queries
import { ListLotteriesQuery } from './list-lotteries.query-handler';

// DTOs
import { LotteryPaginatedResponseDto } from '../../dtos/lottery.paginated-response.dto';

// Database models
import { CardModel } from '../../database/card.model';
import { BoardModel } from '../../database/board.model';

// DI tokens
import { BOARD_MAPPER, CARD_MAPPER } from '../../di-tokens';

@Resolver()
export class ListLotteriesGraphqlResolver {
  constructor(
    @Inject(BOARD_MAPPER)
    protected readonly boardMapper: Mapper<BoardEntity, BoardModel>,
    @Inject(CARD_MAPPER)
    protected readonly cardMapper: Mapper<CardEntity, CardModel>,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => LotteryPaginatedResponseDto)
  async listLotteries(
    @Args('options', { type: () => String })
    options: PaginatedParams<ListLotteriesQuery>,
  ): Promise<LotteryPaginatedResponseDto> {
    const query = new ListLotteriesQuery(options);

    const result: Result<
      Paginated<LotteryEntity>,
      Error
    > = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    const response = new LotteryPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map((lottery) => {
        const props = lottery.getProps();

        const lotteryResponse = {
          id: props.id,
          cards: props.cards?.map(this.cardMapper.toResponse),
          boards: props.boards?.map(this.boardMapper.toResponse),
          numberOfBoards: props.numberOfBoards,
        };

        return lotteryResponse;
      }),
    });

    return response;
  }
}
