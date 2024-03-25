import {
  Column,
  Entity,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CardModel } from './card.model';

@Entity('decks')
export class DeckModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => CardModel, (card) => card.deckId)
  cards: CardModel[];

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
