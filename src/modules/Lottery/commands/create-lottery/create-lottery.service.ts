import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Err, Ok, Result } from 'oxide.ts';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

// DDD
import { ConflictException } from '@src/libs/exceptions';
import { AggregateID, Mapper } from '@src/libs/ddd';

// Domain
import { CardEntity } from '../../domain/card.entity';
import { BoardEntity } from '../../domain/board.entity';
import { LotteryEntity } from '../../domain/lottery.entity';

// Commands
import { CreateLotteryCommand } from './create-lottery.command';

// Database models
import { CardModel } from '../../database/card.model';
import { BoardModel } from '../../database/board.model';
import { LotteryModel } from '../../database/lottery.model';

// DI tokens
import { BOARD_MAPPER, CARD_MAPPER, LOTTERY_MAPPER } from '../../di-tokens';

const NUMBER_OF_CARDS_PER_BOARD = 16;

@CommandHandler(CreateLotteryCommand)
export class CreateLotteryService implements ICommandHandler {
  constructor(
    @InjectRepository(CardModel)
    protected readonly cardRepo: Repository<CardModel>,
    @InjectRepository(BoardModel)
    protected readonly boardRepo: Repository<BoardModel>,
    @InjectRepository(LotteryModel)
    protected readonly lotteryRepo: Repository<LotteryModel>,
    @Inject(CARD_MAPPER)
    protected readonly cardMapper: Mapper<CardEntity, CardModel>,
    @Inject(BOARD_MAPPER)
    protected readonly boardMapper: Mapper<BoardEntity, BoardModel>,
    @Inject(LOTTERY_MAPPER)
    protected readonly lotteryMapper: Mapper<LotteryEntity, LotteryModel>,
  ) {}

  /**
   * Executes the create lottery command.
   *
   * @param command - The create lottery command.
   * @returns A promise that resolves to a Result containing the AggregateID if successful, or an Error if there was a failure.
   */
  async execute(
    command: CreateLotteryCommand,
  ): Promise<Result<AggregateID, Error>> {
    try {
      const deckId = command.deckId;
      const numberOfBoards = command.numberOfBoards;

      const cards = await this.getCards({ deckId });
      const boards: BoardEntity[] = [];

      for (let i = 0; i < numberOfBoards; i++) {
        const board = this.generateUniqueBoard(cards, boards);
        boards.push(board);
      }

      const lottery = LotteryEntity.create({
        cards,
        boards,
        numberOfBoards,
      });

      boards.forEach((board) => board.setLottery(lottery));

      await this.lotteryRepo.save(this.lotteryMapper.toPersistence(lottery));

      await this.boardRepo.save(boards.map(this.boardMapper.toPersistence));

      return Ok(lottery.id);
    } catch (error) {
      if (error instanceof ConflictException) {
        return Err(error);
      }
      throw error;
    }
  }

  /**
   * Retrieves the cards associated with a specific deck.
   * @param {Object} options - The options for retrieving the cards.
   * @param {number} options.deckId - The ID of the deck.
   * @returns {Promise<CardEntity[]>} - A promise that resolves to an array of CardEntity objects.
   */
  private async getCards({ deckId }): Promise<CardEntity[]> {
    const records = await this.cardRepo.find({ where: { deckId } });

    const cards = records.map((record) => this.cardMapper.toDomain(record));

    return cards;
  }

  /**
   * Shuffles an array of CardEntity objects using the Fisher-Yates algorithm.
   * @param cards - The array of CardEntity objects to be shuffled.
   * @returns The shuffled array of CardEntity objects.
   */
  private shuffleCards(cards: CardEntity[]): CardEntity[] {
    const shuffledCards = cards.slice();

    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [
        shuffledCards[j],
        shuffledCards[i],
      ];
    }

    return shuffledCards;
  }

  /**
   * Generates a unique board entity based on the given cards and current boards.
   * @param cards - The list of available cards.
   * @param currentBoards - The list of existing boards.
   * @returns A unique board entity.
   * @throws ConflictException if a unique board cannot be generated.
   */
  private generateUniqueBoard(
    cards: CardEntity[],
    currentBoards: BoardEntity[],
  ): BoardEntity {
    const maxTries = 1000;
    let tries = 0;
    let board: BoardEntity | null = null;

    while (tries < maxTries) {
      const shuffledCards = this.shuffleCards(cards);
      const boardCards = shuffledCards.slice(0, NUMBER_OF_CARDS_PER_BOARD);
      const tempBoard = BoardEntity.create({ cards: boardCards });

      const isUnique = !currentBoards.some((existingBoard) =>
        tempBoard.equals(existingBoard),
      );

      if (isUnique) {
        board = tempBoard;
        break;
      }

      tries++;
    }

    if (board === null)
      throw new ConflictException('Cannot generate unique board');

    return board;
  }
}
