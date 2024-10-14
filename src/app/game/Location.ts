import ILocation from "./ILocation.interface";
import { Inventory } from "./Inventory";

export class Location implements ILocation {
  id!: number;
  name!: string;
  inventory?: Inventory;
  x!: number;
  y!: number;
  size!: number;
  money!: number;

  constructor(id: number, name: string, x: number, y: number, size: number) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.size = size;
  }

  setInventory(inventory: Inventory) {
    this.inventory = inventory;
  };

  setMoney(money: number) {
    this.money = money;
  };

}
