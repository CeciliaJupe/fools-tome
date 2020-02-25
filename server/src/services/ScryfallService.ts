import { Injectable, HttpService, Logger } from '@nestjs/common';
import { Card } from 'src/models/card.entity';
import { configuration } from 'src/app.config';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ScryfallCard } from 'src/models/scryfallCard.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';

import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { fstat } from 'fs';
import { streamValues } from 'stream-json/streamers/StreamValues';
import { resolve } from 'dns';

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
    this.getJson().then(() => {
      const pipeline = chain([
        fs.createReadStream('cardData.txt'),
        parser(),
        streamArray(),
        data => {
          const card = data.value;
          // Logger.log('card: ' + JSON.stringify(card.data));
          return card;
        },
      ]);

      pipeline.on('data', card => {
        // Logger.log('pipeline card: ' + card);
        const newCard = this.cardRepository.create({id: card.id, name: card.name});
        this.cardRepository.update(newCard.id, newCard).then(reason => {
          if (reason.affected === 0) {
            this.cardRepository.save(newCard);
          }
        });
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
