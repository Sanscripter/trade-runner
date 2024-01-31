export class Item {
  name: string;
  cost: number;
  description: string;
  icon?: string;
  quantity?: number;

  constructor(name: string, cost: number, description: string, quantity?: number) {
    this.name = name;
    this.cost = cost;
    this.description = description;
    this.quantity = quantity || 0;
  }

}
