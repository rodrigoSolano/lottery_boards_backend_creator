import { Injectable } from '@nestjs/common';

// DDD
import { Mapper } from '@src/libs/ddd';

// DTOs
import { LotteryModel } from '../database/lottery.model';
import { LotteryResponseDto } from '../dtos/lottery.response.dto';

// Database models
import { LotteryEntity } from '../domain/lottery.entity';

// Mappers
import { CardMapper } from './card.mapper';
import { BoardMapper } from './board.mapper';

@Injectable()
export class LotteryMapper implements Mapper<LotteryEntity, LotteryModel> {
  toPersistence(entity: LotteryEntity): LotteryModel {
    const copy = entity.getProps();
    const record: LotteryModel = LotteryModel.create({
      id: copy.id,
      numberOfBoards: copy.numberOfBoards,
      boards: copy.boards.map((board) =>
        new BoardMapper().toPersistence(board),
      ),
    });

    return record;
  }
  toDomain(record: LotteryModel): LotteryEntity {
    const entity = new LotteryEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        boards: record.boards.map((board) => new BoardMapper().toDomain(board)),
        numberOfBoards: record.numberOfBoards,
      },
    });

    return entity;
  }
  toResponse(entity: LotteryEntity): LotteryResponseDto {
    const props = entity.getProps();
    const response = new LotteryResponseDto(entity);
    response.numberOfBoards = props.numberOfBoards;
    response.boards = props.boards.map((board) =>
      new BoardMapper().toResponse(board),
    );
    response.cards =
      props.cards?.map((card) => new CardMapper().toResponse(card)) || [];

    return response;
  }
}
