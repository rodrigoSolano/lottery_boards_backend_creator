import { Field, ObjectType } from '@nestjs/graphql';

import { PaginatedGraphqlResponse } from '@src/libs/api/graphql/paginated.graphql-response.base';

import { DeckResponseDto } from './lottery.response.dto';

@ObjectType()
export class DeckPaginatedResponseDto extends PaginatedGraphqlResponse(
  DeckResponseDto,
) {
  @Field(() => [DeckResponseDto])
  data: DeckResponseDto[];
}
