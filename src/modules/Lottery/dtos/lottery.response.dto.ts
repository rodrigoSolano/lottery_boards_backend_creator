import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';

import { ResponseBase } from '@src/libs/api/response.base';

@ObjectType()
export class LotteryResponseDto extends ResponseBase {
  @Field()
  @ApiProperty({
    example: '009c600c-cad4-4077-be32-ef8805aca46b',
    description: 'Lottery ID',
  })
  id: string;

  @Field(() => [BoardResponseDto])
  @ApiProperty({
    example: {
      cards: [
        {
          name: '1',
          image: 'https://image.com',
        },
      ],
    },
    description: 'Board',
  })
  boards: BoardResponseDto[];

  @Field(() => [CardResponseDto])
  @ApiProperty({
    example: [
      {
        name: '1',
        image: 'https://image.com',
      },
    ],
    description: 'Cards of the lottery',
  })
  cards: CardResponseDto[];

  @Field()
  @ApiProperty({
    example: 1,
    description: 'Number of boards',
  })
  numberOfBoards: number;
}

@ObjectType()
export class BoardResponseDto extends ResponseBase {
  @Field()
  @ApiProperty({
    example: '009c600c-cad4-4077-be32-ef8805aca46b',
    description: 'Lottery ID',
  })
  id: string;

  @Field(() => [CardResponseDto])
  @ApiProperty({
    example: [
      {
        name: '1',
        image: 'https://image.com',
      },
    ],
    description: 'Cards of the board',
  })
  cards: CardResponseDto[];
}

@ObjectType()
export class CardResponseDto extends ResponseBase {
  @Field()
  @ApiProperty({
    example: '009c600c-cad4-4077-be32-ef8805aca46b',
    description: 'Lottery ID',
  })
  id: string;

  @Field()
  @ApiProperty({
    example: '1',
    description: 'Card ID',
  })
  name: string;

  @Field()
  @ApiProperty({
    example: 'https://image.com',
    description: 'Card image URL',
  })
  image: string;
}

@ObjectType()
export class DeckResponseDto extends ResponseBase {
  @Field()
  @ApiProperty({
    example: '009c600c-cad4-4077-be32-ef8805aca46b',
    description: 'Deck ID',
  })
  id: string;

  @Field()
  @ApiProperty({
    example: 'Deck name',
    description: 'Deck name',
  })
  name: string;

  @Field(() => [CardResponseDto])
  @ApiProperty({
    example: [
      {
        name: '1',
        image: 'https://image.com',
      },
    ],
    description: 'Cards of the deck',
  })
  cards: CardResponseDto[];
}
