import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Ok, Result } from 'oxide.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

// DDD
import { Mapper } from '@src/libs/ddd';

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

export class FindLotteryByIdQuery {
  readonly id: string;

  constructor(props) {
    this.id = props.id;
  }
}

@QueryHandler(FindLotteryByIdQuery)
export class FindLotteryByIdQueryHandler implements IQueryHandler {
  constructor(
    @InjectRepository(CardModel)
    private readonly cardRepository: Repository<CardModel>,
    @Inject(BOARD_MAPPER)
    protected readonly boardMapper: Mapper<BoardEntity, BoardModel>,
    @InjectRepository(LotteryModel)
    private readonly lotteryRepository: Repository<LotteryModel>,
    @Inject(CARD_MAPPER)
    protected readonly cardMapper: Mapper<CardEntity, CardModel>,
    @Inject(LOTTERY_MAPPER)
    protected readonly lotteryMapper: Mapper<LotteryEntity, LotteryModel>,
  ) {}

  async execute(
    query: FindLotteryByIdQuery,
  ): Promise<Result<LotteryEntity, Error>> {
    const cards = await this.cardRepository.find();
    const record = await this.lotteryRepository.findOne({
      where: { id: query.id },
      relations: ['boards', 'boards.cards'],
    });

    if (!record) throw new Error('Lottery not found');

    const lottery = new LotteryEntity({
      id: record.id,
      props: {
        cards: cards.map(this.cardMapper.toDomain),
        boards: record.boards.map(this.boardMapper.toDomain),
        numberOfBoards: record.numberOfBoards,
      },
    });

    return Ok(lottery);
  }
}
