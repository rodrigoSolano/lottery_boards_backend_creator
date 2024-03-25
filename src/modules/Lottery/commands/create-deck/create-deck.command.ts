import { Command, CommandProps } from '@src/libs/ddd';

export class CreateDeckCommand extends Command {
  readonly name: string;
  readonly imagePaths: string[];

  constructor(props: CommandProps<CreateDeckCommand>) {
    super(props);
    this.name = props.name;
    this.imagePaths = props.imagePaths;
  }
}
