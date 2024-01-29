import { Inventory } from "./Inventory";

export class Player {
  name: string;
  inventory: Inventory = new Inventory();
  money: number;
  health: number = 3;

  constructor(name: string, money?: number) {
    this.name = name;
    this.money = money ? money : 0;
  }

  setInventory(inventory: Inventory) {
    this.inventory = inventory;
  };

  setMoney(money: number) {
    this.money = money;
  };

  takeDamage(damage: number) {
    this.health -= damage;
  };

  heal(heal: number) {
    this.health += heal;
  };

}
