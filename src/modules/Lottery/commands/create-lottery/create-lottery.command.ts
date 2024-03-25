import { Command, CommandProps } from '@src/libs/ddd';

export class CreateLotteryCommand extends Command {
  readonly deckId: string;

  readonly numberOfBoards: number;

  constructor(props: CommandProps<CreateLotteryCommand>) {
    super(props);
    this.deckId = props.deckId;
    this.numberOfBoards = props.numberOfBoards;
  }
}
