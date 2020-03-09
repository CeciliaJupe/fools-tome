import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Card } from 'src/cards/card.entity';
import { ScryfallService } from '../services/ScryfallService';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    private readonly scryfallService: ScryfallService,
    ) {}

  async getCard(id: string): Promise<Card> {
    return await this.cardRepository.findOne({id});
  }

  getCardsByCardSet(setName: string): Promise<Card[]> {
    return this.cardRepository.createQueryBuilder('card')
      .innerJoinAndSelect('card.cardSet', 'cardSet', 'cardSet.setCode = :setCode', {setCode: setName})
      .getMany();
  }
}
