import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Provider } from '@nestjs/common';

// Command handlers
import { CreateDeckService } from './commands/create-deck/create-deck.service';
import { CreateLotteryService } from './commands/create-lottery/create-lottery.service';

// Query handlers
import { FindLotteryByIdQueryHandler } from './queries/find-lottery-by-id/find-lottery-by-id.query-handler';
import { ListLotteriesQueryHandler } from './queries/list-lotteries/list-lotteries.query-handler';
import { ListDecksQueryHandler } from './queries/list-decks/list-decks.query-handler';

// GraphQL resolvers
import { ListDecksGraphqlResolver } from './queries/list-decks/list-decks.graphql-resolver';
import { CreateDeckGraphqlResolver } from './commands/create-deck/create-deck.graphql-resolver';
import { ListLotteriesGraphqlResolver } from './queries/list-lotteries/list-lotteries.graphql-resolver';
import { CreateLotteryGraphqlResolver } from './commands/create-lottery/create-lottery.graphql-resolver';
import { FindLotteryByIdGraphqlResolver } from './queries/find-lottery-by-id/find-lottery-by-id.graphql-resolver';

// Database models
import { CardModel } from './database/card.model';
import { DeckModel } from './database/deck.model';
import { BoardModel } from './database/board.model';
import { LotteryModel } from './database/lottery.model';

// Mappers
import { CardMapper } from './mappers/card.mapper';
import { DeckMapper } from './mappers/deck.mapper';
import { BoardMapper } from './mappers/board.mapper';
import { LotteryMapper } from './mappers/lottery.mapper';

// DI tokens
import {
  DECK_MAPPER,
  CARD_MAPPER,
  BOARD_MAPPER,
  LOTTERY_MAPPER,
} from './di-tokens';

const graphqlResolvers: Provider[] = [
  ListDecksGraphqlResolver,
  CreateDeckGraphqlResolver,
  CreateLotteryGraphqlResolver,
  ListLotteriesGraphqlResolver,
  FindLotteryByIdGraphqlResolver,
];

const commandHandlers: Provider[] = [CreateDeckService, CreateLotteryService];

const queryHandlers: Provider[] = [
  ListDecksQueryHandler,
  ListLotteriesQueryHandler,
  FindLotteryByIdQueryHandler,
];

const mappers: Provider[] = [
  {
    provide: CARD_MAPPER,
    useClass: CardMapper,
  },
  {
    provide: DECK_MAPPER,
    useClass: DeckMapper,
  },
  {
    provide: BOARD_MAPPER,
    useClass: BoardMapper,
  },
  {
    provide: LOTTERY_MAPPER,
    useClass: LotteryMapper,
  },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([LotteryModel, CardModel, DeckModel, BoardModel]),
  ],
  providers: [
    ...graphqlResolvers,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class LotteryModule {}
