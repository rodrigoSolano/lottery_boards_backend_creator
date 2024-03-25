import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeckModel } from './deck.model';

@Entity('cards')
export class CardModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  image: string;

  @Column()
  deckId: string;

  @ManyToOne(() => DeckModel)
  @JoinColumn({ name: 'deckId' })
  deck: DeckModel;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
