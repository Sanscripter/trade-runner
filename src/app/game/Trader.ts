import { Inventory } from "./Inventory";

export class Trader {
  _name: string;
  _inventory: Inventory;
  _money: number = 0;

  constructor(name: string, inventroy: Inventory) {
    this._name = name;
    this._inventory = inventroy;
  }

  get name() {
    return this._name;
  }

  get inventory() {
    return this._inventory;
  }

  get money() {
    return this._money;
  }

  setInventory(inventory: Inventory) {
    this._inventory = inventory;
  };

  setMoney(money: number) {
    this._money = money;
  };

}
