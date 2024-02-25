import { Inventory } from "./Inventory";

export class Player {
  id = 0;
  name: string;
  inventory: Inventory = new Inventory();
  money: number;
  health: number = 3;
  position: { x: number, y: number } = { x: 70, y: 70 };

  constructor(name: string, money?: number) {
    this.name = name;
    this.money = money ? money : 0;
  }

  get stealingChance() {
    return 0.5;
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
