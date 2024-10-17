import { Item } from './Item';

export class Effect {
  id = '';
  name = '';
  description = '';
  level = 0;
  source: null | Item = null;
}
