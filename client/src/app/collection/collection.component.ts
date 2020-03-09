import { Component, OnInit } from '@angular/core';
import { Card } from '../cards/card.model';
import { CollectionService } from './collection.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  cards: Card[];

  constructor(private readonly collectionService: CollectionService) { }

  ngOnInit(): void {
    this.getCards();
  }

  private getCards(): void {
    this.collectionService.getCardsByCardSetCode('')
      .subscribe(cards => this.cards = cards);
  }

}
