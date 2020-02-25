import { Controller, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { ScryfallService } from './services/ScryfallService';
import { Card } from './models/card.entity';
import { CardService } from './services/card.service';

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
    const card = await this.cardService.getCard('7220aaa0-c457-4067-b1ff-360b161c34e5');
    return card.name;
  }

  @Get('/update')
  updateCards(): void {
    return this.scryfallService.updateCards();
  }

}
