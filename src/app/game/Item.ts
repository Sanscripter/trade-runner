export class Item {
  id?: number;
  name: string;
  cost?: number; //what it sells for
  value: number; //theoretical intrinsic worth
  originalValue?: number; //value it was bought for
  description: string;
  icon?: string;
  quantity?: number;
  img?: string = 'tool.png';

  constructor(name: string, value: number, description: string, quantity?: number, id?: number, img?: string) {
    this.name = name;
    this.value = value;
    this.cost = this.value; //item cost is initialized at 100% of value
    this.description = description;
    this.quantity = quantity || 0;
    this.id = id;
    this.img = img || 'tool.png';
  }
}
