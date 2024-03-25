import {
  Entity,
  Column,
  ManyToOne,
  JoinTable,
  BaseEntity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CardModel } from './card.model';
import { LotteryModel } from './lottery.model';

@Entity('boards')
export class BoardModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => CardModel)
  @JoinTable()
  cards: CardModel[];

  @ManyToOne(() => LotteryModel, (lottery) => lottery.boards)
  lottery: LotteryModel;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: string;
}
