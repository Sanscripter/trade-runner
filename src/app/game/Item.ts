import { Effect } from './Effect';

export class Item {
  id?: number;
  name: string;
  value: number; //theoretical intrinsic worth
  description: string;
  image?: string = 'tool.png';
  slotSize?: number = 1;
  effects?: Effect[] = [];

  constructor(
    name: string,
    value: number,
    description: string,
    id?: number,
    image?: string,
    slotSize?: number,
    effects?: Effect[]
  ) {
    this.name = name;
    this.value = value;
    this.description = description;
    this.id = id;
    this.image = image || 'tool.png';
    this.slotSize = slotSize || 1;
    this.effects = effects || [];
  }
}
