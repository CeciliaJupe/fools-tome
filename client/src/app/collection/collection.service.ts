import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Card } from '../cards/card.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private readonly GET_CARDS_BY_CARDSET_PATH: string = '/cards/cardsByCardSet/' + 'mmq';

  constructor(private readonly http: HttpClient) { }

  public getCardsByCardSetCode(setCode: string): Observable<Card[]> {
    return this.http.get<Card[]>(environment.host + this.GET_CARDS_BY_CARDSET_PATH);
  }
}
