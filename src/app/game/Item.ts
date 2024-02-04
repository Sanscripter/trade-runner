export class Item {
  id?: number;
  name: string;
  cost: number;
  value: number;
  description: string;
  icon?: string;
  quantity?: number;

  constructor(name: string, value: number, description: string, quantity?: number, id?: number) {
    this.name = name;
    this.value = value;
    this.cost = this.value; //item cost is initialized at 100% of value
    this.description = description;
    this.quantity = quantity || 0;
  }
}
