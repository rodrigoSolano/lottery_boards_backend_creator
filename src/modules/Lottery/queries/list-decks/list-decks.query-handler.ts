import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Ok, Result } from 'oxide.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

// DDD
import { Mapper, Paginated } from '@src/libs/ddd';
import { PaginatedParams, PaginatedQueryBase } from '@src/libs/ddd/query.base';

// Domain
import { DeckEntity } from '../../domain/deck.entity';

// Database models
import { CardModel } from '../../database/card.model';
import { DeckModel } from '../../database/deck.model';

// DI tokens
import { DECK_MAPPER } from '../../di-tokens';

export class ListDecksQuery extends PaginatedQueryBase {
  constructor(props: PaginatedParams<ListDecksQuery>) {
    super(props);
  }
}

@QueryHandler(ListDecksQuery)
export class ListDecksQueryHandler implements IQueryHandler {
  constructor(
    @InjectRepository(DeckModel)
    private readonly deckRepository: Repository<DeckModel>,
    @InjectRepository(CardModel)
    private readonly cardRepository: Repository<CardModel>,
    @Inject(DECK_MAPPER)
    private readonly deckMapper: Mapper<DeckEntity, DeckModel>,
  ) {}

  async execute(
    query: ListDecksQuery,
  ): Promise<Result<Paginated<DeckEntity>, Error>> {
    const decks = await this.deckRepository.find({
      take: query.limit,
      skip: query.offset,
    });

    for (const deck of decks) {
      const cards = await this.cardRepository.find({
        where: { deckId: deck.id },
      });

      deck.cards = cards;
    }

    const deckEntities = decks.map((deck) => this.deckMapper.toDomain(deck));

    return Ok(
      new Paginated({
        data: deckEntities,
        count: 0,
        limit: query.limit,
        page: query.page,
      }),
    );
  }
}
