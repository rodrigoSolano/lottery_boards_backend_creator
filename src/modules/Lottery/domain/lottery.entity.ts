import { randomUUID } from 'crypto';

import { AggregateID, AggregateRoot } from '@src/libs/ddd';

import { CardEntity } from './card.entity';
import { BoardEntity } from './board.entity';

export interface CreateLotteryProps {
  cards?: CardEntity[];
  boards: BoardEntity[];
  numberOfBoards: number;
}

export interface LotteryProps extends CreateLotteryProps {}

export class LotteryEntity extends AggregateRoot<LotteryProps> {
  protected readonly _id: AggregateID;

  protected readonly _cards: CardEntity[];

  protected readonly _boards: BoardEntity[];

  static create(create: CreateLotteryProps): LotteryEntity {
    const id = randomUUID();
    const props: LotteryProps = { ...create };
    const lottery = new LotteryEntity({ id, props });

    return lottery;
  }

  public get cards(): CardEntity[] {
    return this._cards;
  }

  public get boards(): BoardEntity[] {
    return this._boards;
  }

  public get numberOfBoards(): number {
    return this.props.numberOfBoards;
  }

  public validate(): void {
    return;
  }
}
