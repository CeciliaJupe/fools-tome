import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ScryfallService } from './services/ScryfallService';
import { Card } from './cards/card.entity';
import { CardService } from './cards/card.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private cardService: CardService,
    private scryfallService: ScryfallService,
    ) {}

  private card: Card;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/card')
  async getCard(): Promise<string> {
    this.card = await this.cardService.getCard('7220aaa0-c457-4067-b1ff-360b161c34e5');
    return this.card.name;
  }

  @Get('/update')
  updateCards(): void {
    this.scryfallService.clearTables();
    setTimeout(() => {
      this.scryfallService.updateCardSets();
      setTimeout(() => {
        this.scryfallService.updateCards();
      }, 1000);
    }, 1000);
  }

}
