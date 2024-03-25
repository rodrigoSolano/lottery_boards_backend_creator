import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Ok, Result } from 'oxide.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Mapper, Paginated } from '@src/libs/ddd';
import { PaginatedParams, PaginatedQueryBase } from '@src/libs/ddd/query.base';

// Domain
import { CardEntity } from '../../domain/card.entity';
import { BoardEntity } from '../../domain/board.entity';
import { LotteryEntity } from '../../domain/lottery.entity';

// Database models
import { CardModel } from '../../database/card.model';
import { BoardModel } from '../../database/board.model';
import { LotteryModel } from '../../database/lottery.model';

// DI tokens
import { BOARD_MAPPER, CARD_MAPPER, LOTTERY_MAPPER } from '../../di-tokens';

export class ListLotteriesQuery extends PaginatedQueryBase {
  readonly id: string;

  constructor(props: PaginatedParams<ListLotteriesQuery>) {
    super(props);
    this.id = props.id;
  }
}

@QueryHandler(ListLotteriesQuery)
export class ListLotteriesQueryHandler implements IQueryHandler {
  constructor(
    @InjectRepository(CardModel)
    private readonly cardRepository: Repository<CardModel>,
    @InjectRepository(LotteryModel)
    private readonly lotteryRepository: Repository<LotteryModel>,
    @Inject(BOARD_MAPPER)
    protected readonly boardMapper: Mapper<BoardEntity, BoardModel>,
    @Inject(CARD_MAPPER)
    protected readonly cardMapper: Mapper<CardEntity, CardModel>,
    @Inject(LOTTERY_MAPPER)
    protected readonly lotteryMapper: Mapper<LotteryEntity, LotteryModel>,
  ) {}

  async execute(
    query: ListLotteriesQuery,
  ): Promise<Result<Paginated<LotteryEntity>, Error>> {
    const cards = await this.cardRepository.find();
    const lotteries = await this.lotteryRepository.find({
      relations: ['boards', 'boards.cards'],
      take: query.limit,
      skip: query.offset,
    });

    const lotteryEntities = lotteries.map(
      (lottery) =>
        new LotteryEntity({
          id: lottery.id,
          props: {
            cards: cards.map(this.cardMapper.toDomain),
            boards: lottery.boards.map(this.boardMapper.toDomain),
            numberOfBoards: lottery.boards.length,
          },
          createdAt: new Date(lottery.createdAt),
          updatedAt: new Date(lottery.updatedAt),
        }),
    );

    return Ok(
      new Paginated({
        data: lotteryEntities,
        count: 0,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
