import { Injectable, HttpService } from '@nestjs/common';
import { Card } from 'src/models/card.entity';
import { configuration } from 'src/app.config';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class ScryfallService {
  constructor(private readonly httpService: HttpService) {}

  getCard(id: string): Observable<AxiosResponse<Card>> {
    return this.httpService.get(configuration.scryfallUrl + '/cards/' + id);
  }
}
