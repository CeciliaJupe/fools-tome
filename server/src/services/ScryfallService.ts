import { Injectable, HttpService, Logger } from '@nestjs/common';
import { Card } from 'src/cards/card.entity';
import { configuration } from 'src/app.config';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ScryfallCard } from 'src/models/scryfallCard.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, Not } from 'typeorm';
import * as fs from 'fs';

import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { CardSet } from 'src/models/cardSet.entity';
import { CardCount } from 'src/models/cardCount.entity';
const Batch = require('stream-json/utils/batch');

@Injectable()

export class ScryfallService {
  private readonly SCRYFALL_BULK_DATA_URL = 'https://archive.scryfall.com/json/scryfall-default-cards.json';
  private readonly SCRYFALL_CARD_SETS_URL = 'https://api.scryfall.com/sets';

  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @InjectRepository(CardCount) private readonly cardCountRepository: Repository<CardCount>,
    @InjectRepository(CardSet) private readonly cardSetRepository: Repository<CardSet>,
    private readonly httpService: HttpService,
    ) {}

  getCard(id: string): Observable<AxiosResponse<ScryfallCard>> {
    return this.httpService.get(configuration.scryfallUrl + '/cards/' + id);
  }

  updateCards(): void {
    this.getJson(this.SCRYFALL_BULK_DATA_URL).then(() => {
      const pipeline = chain([
        fs.createReadStream('cardData.txt'),
        parser(),
        streamArray(),
        new Batch({batchSize: 100}),
      ]);

      pipeline.on('data', cards => {
        const cardSetLookup: any[] = [];
        this.cardSetRepository.find()
          .then(cardSetsRaw => {
            for (const cardSet of cardSetsRaw) {
              cardSetLookup.push({ cardSet, setCode: cardSet.setCode });
            }
          })
          .then(() => {
            const cardBatch: Card[] = [];
            for (const card of cards) {
              const cardSetCode: any = cardSetLookup
                .find(code => code.setCode === card.value.set)
                .cardSet;
              const cardWithoutCode: Card = this.cardRepository.create({ id: card.value.id, name: card.value.name });
              // Logger.log(cardSetCode);
              cardWithoutCode.cardSet = cardSetCode.id;
              cardBatch.push(cardWithoutCode);
            }
            getConnection()
              .createQueryBuilder()
              .insert()
              .into(Card)
              .values(cardBatch)
              .execute()
              .catch(error => Logger.log(error));
          });
          });
    });
  }

  updateCardSets(): void {
    const observable: Observable<AxiosResponse<any>>
      = this.httpService.get(this.SCRYFALL_CARD_SETS_URL);
    observable.subscribe(axiosResponse => {
      const cardSets: CardSet[] = [];
      for (const cardSet of axiosResponse.data.data) {
        cardSets.push(this.cardSetRepository.create({ id: cardSet.id, name: cardSet.name, setCode: cardSet.code, setType: cardSet.set_type }));
      }
      getConnection()
        .createQueryBuilder()
        .insert()
        .into(CardSet)
        .values(cardSets)
        .execute()
        .catch(error => Logger.log(error));
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

  clearTables(): void {
    getConnection()
      .createQueryBuilder()
      .delete()
      .from(CardSet)
      .execute();
    getConnection()
      .createQueryBuilder()
      .delete()
      .from(Card)
      .execute();
  }
}
