import { Injectable, HttpService, Logger } from '@nestjs/common';
import { Card } from 'src/models/card.entity';
import { configuration } from 'src/app.config';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ScryfallCard } from 'src/models/scryfallCard.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import * as fs from 'fs';

import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
const Batch = require('stream-json/utils/batch');

@Injectable()

export class ScryfallService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    private readonly httpService: HttpService,
    ) {}

  getCard(id: string): Observable<AxiosResponse<ScryfallCard>> {
    return this.httpService.get(configuration.scryfallUrl + '/cards/' + id);
  }

  updateCards(): void {
    this.cardRepository.clear();
    this.getJson().then(() => {
      const pipeline = chain([
        fs.createReadStream('cardData.txt'),
        parser(),
        streamArray(),
        new Batch({batchSize: 100}),
      ]);

      pipeline.on('data', cards => {
        // Logger.log('pipeline card: ' + card);
        const cardBatch: any[] = [];
        for (const card of cards) {
          // Logger.log(JSON.stringify(card));
          cardBatch.push(this.cardRepository.create({id: card.value.id, name: card.value.name}));
        }
        getConnection()
          .createQueryBuilder()
          .insert()
          .into(Card)
          .values(cardBatch)
          .execute();
      });
    });
  }

  async getJson(): Promise<void> {
    return new Promise((resolve, reject) => {
      const observable: Observable<AxiosResponse<any>>
        = this.httpService.get('https://archive.scryfall.com/json/scryfall-default-cards.json');
      observable.subscribe(axiosResponse => {
        // Logger.log(axiosResponse.data);
        fs.writeFile('cardData.txt', JSON.stringify(axiosResponse.data), error => Logger.log(error));
        resolve();
      });
    });
  }

}
