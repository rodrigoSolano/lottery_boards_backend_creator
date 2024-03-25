import { Field, ObjectType } from '@nestjs/graphql';

import { PaginatedGraphqlResponse } from '@src/libs/api/graphql/paginated.graphql-response.base';

import { LotteryResponseDto } from './lottery.response.dto';

@ObjectType()
export class LotteryPaginatedResponseDto extends PaginatedGraphqlResponse(
  LotteryResponseDto,
) {
  @Field(() => [LotteryResponseDto])
  data: LotteryResponseDto[];
}
