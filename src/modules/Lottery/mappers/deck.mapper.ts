import { Injectable } from '@nestjs/common';

// DDD
import { Mapper } from '@src/libs/ddd';

// Domain
import { DeckEntity } from '../domain/deck.entity';

// Database models
import { DeckModel } from '../database/deck.model';

// Mappers
import { CardMapper } from './card.mapper';

// Dtos
import { DeckResponseDto } from '../dtos/lottery.response.dto';

@Injectable()
export class DeckMapper implements Mapper<DeckEntity, DeckModel> {
  toPersistence(entity: DeckEntity): DeckModel {
    const copy = entity.getProps();
    const record: DeckModel = DeckModel.create({
      id: copy.id,
      name: copy.name,
      createdAt: copy.createdAt.toISOString(),
      updatedAt: copy.updatedAt.toISOString(),
    });

    return record;
  }

  toDomain(record: DeckModel): DeckEntity {
    const entity = new DeckEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        name: record.name,
        cards: record.cards.map((card) => new CardMapper().toDomain(card)),
      },
    });

    return entity;
  }

  toResponse(entity: DeckEntity): DeckResponseDto {
    const props = entity.getProps();
    const response = new DeckResponseDto(entity);
    response.id = props.id;
    response.name = props.name;
    response.cards =
      props.cards?.map((card) => new CardMapper().toResponse(card)) || [];

    return response;
  }
}
