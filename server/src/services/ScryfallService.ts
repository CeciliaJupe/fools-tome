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
import { CardSet } from 'src/models/cardSet.entity';
const Batch = require('stream-json/utils/batch');

@Injectable()

export class ScryfallService {
  private readonly SCRYFALL_BULK_DATA_URL = 'https://archive.scryfall.com/json/scryfall-default-cards.json';
  private readonly SCRYFALL_CARD_SETS_URL = '';

  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(CardSet) private readonly cardSetRepository: Repository<CardSet>,
    private readonly httpService: HttpService,
    ) {}

  getCard(id: string): Observable<AxiosResponse<ScryfallCard>> {
    return this.httpService.get(configuration.scryfallUrl + '/cards/' + id);
  }

  updateCards(): void {
    this.cardRepository.clear();
    this.getJson(this.SCRYFALL_BULK_DATA_URL).then(() => {
      const pipeline = chain([
        fs.createReadStream('cardData.txt'),
        parser(),
        streamArray(),
        new Batch({batchSize: 100}),
      ]);

      pipeline.on('data', cards => {
        const cardBatch: any[] = [];
        for (const card of cards) {
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

  updateCardSets(): void {
    this.cardSetRepository.clear();
    const observable: Observable<AxiosResponse<CardSet[]>>
      = this.httpService.get(this.SCRYFALL_CARD_SETS_URL);
    observable.subscribe(axiosResponse => {
      getConnection()
        .createQueryBuilder()
        .insert()
        .into(CardSet)
        .values(axiosResponse.data)
        .execute();
    });
  }

  async getJson(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const observable: Observable<AxiosResponse<any>>
        = this.httpService.get(url);
      observable.subscribe(axiosResponse => {
        fs.writeFile('cardData.txt', JSON.stringify(axiosResponse.data), error => Logger.log(error));
        resolve();
      });
    });
  }
}
