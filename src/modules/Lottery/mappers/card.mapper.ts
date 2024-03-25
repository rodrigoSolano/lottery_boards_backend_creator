import { Injectable } from '@nestjs/common';

// DDD
import { Mapper } from '@src/libs/ddd';

// Domain
import { CardEntity } from '../domain/card.entity';

// DTOs
import { CardResponseDto } from '../dtos/lottery.response.dto';

// Database models
import { CardModel } from '../database/card.model';

@Injectable()
export class CardMapper implements Mapper<CardEntity, CardModel> {
  toPersistence(entity: CardEntity): CardModel {
    const copy = entity.getProps();
    const record: CardModel = CardModel.create({
      id: copy.id,
      name: copy.name,
      image: copy.image,
      deckId: copy.deckId,
      createdAt: copy.createdAt.toISOString(),
      updatedAt: copy.updatedAt.toISOString(),
    });

    return record;
  }
  toDomain(record: CardModel): CardEntity {
    const entity = new CardEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        name: record.name,
        image: record.image,
        deckId: record.deckId,
      },
    });

    return entity;
  }
  toResponse(entity: CardEntity): CardResponseDto {
    const props = entity.getProps();
    const response = new CardResponseDto(entity);
    response.name = props.name || '';
    response.image = props.image;

    return response;
  }
}
