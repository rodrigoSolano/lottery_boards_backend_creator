import { Result } from 'oxide.ts';
import { mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { CommandBus } from '@nestjs/cqrs';
import { createWriteStream } from 'fs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

// DD
import { AggregateID } from '@src/libs/ddd';

// DTOs
import { IdResponse } from '../../dtos/id.response.dto';
import { CreateDeckRequestDto } from './dtos/create-deck.request.dto';

// Commands
import { CreateDeckCommand } from './create-deck.command';

@Resolver()
export class CreateDeckGraphqlResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => IdResponse)
  async createDeck(
    @Args('input') input: CreateDeckRequestDto,
    @Args({ name: 'images', type: () => [GraphQLUpload] })
    images: FileUpload[],
  ): Promise<IdResponse> {
    const imagesResolved = await Promise.all(images);
    const imagePaths = await processImages(imagesResolved);
    const command = new CreateDeckCommand({ name: input.name, imagePaths });

    const id: Result<AggregateID, Error> =
      await this.commandBus.execute(command);

    return new IdResponse(id.unwrap());
  }
}

async function processImages(images: FileUpload[]) {
  const imagePaths = images.map((image) => {
    const { createReadStream } = image;
    const filename = randomUUID();
    const extension = image.filename.split('.').pop();
    const path = `./uploads/${filename}.${extension}`;
    try {
      mkdirSync('./uploads');
    } catch (error) {
      // Directory already exists
    }
    createReadStream().pipe(createWriteStream(path));
    return `uploads/${filename}.${extension}`;
  });

  return imagePaths;
}
