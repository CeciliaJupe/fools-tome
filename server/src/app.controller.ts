import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private ScryfallService,
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
    }

  @Get('/card')
  getCard(): string {
    return this.ScryfallService.getCard('7220aaa0-c457-4067-b1ff-360b161c34e5');
  }
}
