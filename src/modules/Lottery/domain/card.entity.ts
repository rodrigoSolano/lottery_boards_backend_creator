import { randomUUID } from 'crypto';

import { AggregateID, AggregateRoot } from '@src/libs/ddd';

export interface CreateCardProps {
  name: string;
  image: string;
  deckId: AggregateID;
}

export interface CardProps extends CreateCardProps {}

export class CardEntity extends AggregateRoot<CardProps> {
  protected readonly _id: AggregateID;

  static create(create: CreateCardProps): CardEntity {
    const id = randomUUID();
    const props: CardProps = { ...create };
    const card = new CardEntity({ id, props });

    return card;
  }

  public validate(): void {
    return;
  }
}
