import { Controller, Get, Param } from '@nestjs/common';
import { CardService } from './card.service';
import { Card } from './card.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('cards')
export class CardController {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    private readonly cardService: CardService,
    ) {}

  private card: Card;

  @Get('card/:id')
  getCardById(@Param('id') id: string): Promise<Card> {
    return this.cardRepository.findOne({id});
  }

  @Get('cardsByCardSet/:setName')
  getCardsByCardSet(@Param('setName') setName: string): Promise<Card[]> {
    return this.cardService.getCardsByCardSet(setName);
  }

}
