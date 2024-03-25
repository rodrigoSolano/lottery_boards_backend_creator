import { Inject } from '@nestjs/common';
import { Ok, Result } from 'oxide.ts';
import { Repository } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

// DDD
import { AggregateID, Mapper } from '@src/libs/ddd';

// Domain
import { DeckEntity } from '../../domain/deck.entity';
import { CardEntity } from '../../domain/card.entity';

// Commands
import { CreateDeckCommand } from './create-deck.command';

// Database models
import { DeckModel } from '../../database/deck.model';
import { CardModel } from '../../database/card.model';

// DI tokens
import { CARD_MAPPER, DECK_MAPPER } from '../../di-tokens';

@CommandHandler(CreateDeckCommand)
export class CreateDeckService implements ICommandHandler {
  constructor(
    @InjectRepository(CardModel)
    private readonly cardRepository: Repository<CardModel>,
    @InjectRepository(DeckModel)
    private readonly deckRepository: Repository<DeckModel>,
    @Inject(CARD_MAPPER)
    private readonly cardMapper: Mapper<CardEntity, CardModel>,
    @Inject(DECK_MAPPER)
    private readonly deckMapper: Mapper<DeckEntity, DeckModel>,
  ) {}

  async execute(
    command: CreateDeckCommand,
  ): Promise<Result<AggregateID, Error>> {
    const imagePaths = command.imagePaths;
    const deckName = command.name;

    const deck: DeckEntity = DeckEntity.create({
      name: deckName,
      cards: [],
    });

    const cards: CardEntity[] = imagePaths.map((imagePath) =>
      CardEntity.create({
        name: imagePath,
        image: imagePath,
        deckId: deck.id,
      }),
    );

    await this.deckRepository.save(this.deckMapper.toPersistence(deck));

    await this.cardRepository.save(cards.map(this.cardMapper.toPersistence));

    return Ok(deck.id);
  }
}
