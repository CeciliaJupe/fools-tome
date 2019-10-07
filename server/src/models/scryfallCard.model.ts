import { Card } from './card.entity';

export class ScryfallCard {
  id: string;
  name: string;
  // tslint:disable: variable-name
  set_name: string;
  collector_number: string;
  colors: string[];
  type_line: string;
  // tslint:enable: variable-name
}
