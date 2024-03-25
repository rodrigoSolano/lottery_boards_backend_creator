import { randomUUID } from 'crypto';
import { AggregateRoot } from '@src/libs/ddd';

import { CardEntity } from './card.entity';

export interface CreateDeckProps {
  name: string;
  cards?: CardEntity[];
}

export interface DeckProps extends CreateDeckProps {}

export class DeckEntity extends AggregateRoot<CreateDeckProps> {
  protected _id: string;

  static create(create: CreateDeckProps): DeckEntity {
    const id = randomUUID();
    const props: CreateDeckProps = { ...create };
    const deck = new DeckEntity({ id, props });

    return deck;
  }

  set cards(cards: CardEntity[]) {
    this.props.cards = cards;
  }

  public validate(): void {
    return;
  }
}
