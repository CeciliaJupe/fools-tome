import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ScryfallService } from './services/ScryfallService';
import { CardService } from './services/card.service';
import { Card } from './models/card.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([Card]),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CardService,
    ScryfallService,
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
