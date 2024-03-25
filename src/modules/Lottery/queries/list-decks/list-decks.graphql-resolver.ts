import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

// DDD
import { Mapper } from '@src/libs/ddd';
import { PaginatedParams } from '@src/libs/ddd/query.base';

// Domain
import { DeckEntity } from '../../domain/deck.entity';

// Dtos
import { DeckPaginatedResponseDto } from '../../dtos/deck.paginated-response.dto';

// Queries
import { ListDecksQuery } from './list-decks.query-handler';

// Database models
import { DeckModel } from '../../database/deck.model';

// DI tokens
import { DECK_MAPPER } from '../../di-tokens';

@Resolver()
export class ListDecksGraphqlResolver {
  constructor(
    @Inject(DECK_MAPPER)
    protected readonly deckMapper: Mapper<DeckEntity, DeckModel>,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => DeckPaginatedResponseDto)
  async listDecks(
    @Args('options', { type: () => String })
    options: PaginatedParams<ListDecksQuery>,
  ): Promise<DeckPaginatedResponseDto> {
    const query = new ListDecksQuery(options);

    const result = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    return new DeckPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map((deck) => this.deckMapper.toResponse(deck)),
    });
  }
}
