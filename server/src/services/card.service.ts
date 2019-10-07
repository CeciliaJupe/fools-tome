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
      const cardData = await this.scryfallService.getCard(id)
        .toPromise();
      const sfCard = cardData.data;
      card = await this.cardRepository.create({
        id: sfCard.id,
        name: sfCard.name,
        setName: sfCard.set_name,
        collectorNumber: sfCard.collector_number,
        colors: sfCard.colors,
        cardType: sfCard.type_line,
      });
      card = await this.cardRepository.save(card);
    }
    return card;
  }
}
