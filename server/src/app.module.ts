import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ScryfallService } from './services/ScryfallService';
import { CardService } from './services/card.service';
import { Card } from './models/card.entity';
import { CardSet } from './models/cardSet.entity';
import { CardCount } from './models/cardCount.entity';
import { User } from './models/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Card, CardSet, CardCount, User]),
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
