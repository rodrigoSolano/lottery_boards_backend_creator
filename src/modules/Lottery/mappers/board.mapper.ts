import { Injectable } from '@nestjs/common';

// DDD
import { Mapper } from '@src/libs/ddd';

// Domain
import { BoardEntity } from '../domain/board.entity';

// DTOs
import { BoardResponseDto } from '../dtos/lottery.response.dto';

// Database models
import { BoardModel } from '../database/board.model';
import { LotteryModel } from '../database/lottery.model';

// Mappers
import { CardMapper } from './card.mapper';

@Injectable()
export class BoardMapper implements Mapper<BoardEntity, BoardModel> {
  toPersistence(entity: BoardEntity): BoardModel {
    const copy = entity.getProps();
    const record: BoardModel = BoardModel.create({
      id: copy.id,
      cards: copy.cards.map((card) => new CardMapper().toPersistence(card)),
      lottery: LotteryModel.create({
        id: entity.lottery.id,
      }),
    });
    return record;
  }
  toDomain(record: BoardModel): BoardEntity {
    const entity = new BoardEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        cards: record.cards.map((card) => new CardMapper().toDomain(card)),
      },
    });
    return entity;
  }
  toResponse(entity: BoardEntity): BoardResponseDto {
    const props = entity.getProps();
    const response = new BoardResponseDto(entity);
    response.cards = props.cards.map((card) =>
      new CardMapper().toResponse(card),
    );
    return response;
  }
}
