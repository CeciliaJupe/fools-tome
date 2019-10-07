import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Card } from 'src/models/card.entity';
import { ScryfallService } from './ScryfallService';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    private readonly scryfallService: ScryfallService,
    ) {}

  async getCard(id: string): Promise<Card> {
    let card = await this.cardRepository.findOne({id});
    if (card == null) {
      card = await this.scryfallService.getCard(id)
        .toPromise()
        .then(cardPromise => {
          const data = cardPromise.data;
          return this.cardRepository.save({
            id: data.id,
            name: data.name,
          });
        });
    }
    return card;
  }
}
