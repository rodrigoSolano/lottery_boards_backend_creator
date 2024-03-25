import { randomUUID } from 'crypto';

import { AggregateID, AggregateRoot } from '@src/libs/ddd';

import { CardEntity } from './card.entity';
import { LotteryEntity } from './lottery.entity';

export interface CreateBoardProps {
  cards: CardEntity[];
  lottery?: LotteryEntity;
}

export interface BoardProps extends CreateBoardProps {}

export class BoardEntity extends AggregateRoot<BoardProps> {
  protected readonly _id: AggregateID;

  static create(create: CreateBoardProps): BoardEntity {
    const id = randomUUID();
    const props: BoardProps = { ...create };
    const board = new BoardEntity({ id, props });

    return board;
  }

  public get cards(): CardEntity[] {
    return this.props.cards;
  }

  public get lottery(): LotteryEntity {
    return this.props.lottery as LotteryEntity;
  }

  public setLottery(lottery: LotteryEntity): void {
    this.props.lottery = lottery;
  }

  addCard(card: CardEntity): void {
    if (this.cards.length >= 16 || this.cards.some((c) => c.id === card.id)) {
      throw new Error('Cannot add more cards or duplicate cards.');
    }
    this.cards.push(card);
  }

  public validate(): void {
    return;
  }

  /**
   * Checks if the current board is equal to the provided board.
   * Two boards are considered equal if they have the same number of cards and at least 50% of the cards match in the same order.
   * @param board - The board to compare with.
   * @returns `true` if the boards are equal, `false` otherwise.
   */
  public equals(board: BoardEntity): boolean {
    if (this.cards.length !== board.cards.length) {
      return false;
    }

    const matchingCards = this.cards.filter(
      (card, index) => card === board.cards[index],
    ).length;
    const differenceThreshold = this.cards.length * 0.5;

    return matchingCards >= differenceThreshold;
  }
}
