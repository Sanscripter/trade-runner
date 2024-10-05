import ICity from "../utils/ICity.interface";
import { Inventory } from "./Inventory";

export class Player {
  id = 0;
  name: string;
  inventory: Inventory = new Inventory();
  money: number;
  health: number = 5;
  position: { x: number, y: number } = { x: 70, y: 70 };
  targetPosition?: { x: number, y: number };
  speed: number = 150; //default speed (assuming arbitrary dimensions)


  constructor(name: string, money?: number) {
    this.name = name;
    this.money = money ? money : 0;
  }

  get stealingChance() {
    return 0.5; //TODO: ADD LOGIC TO CALCULATE STEALING CHANCE BASED ON STATS AND INVENTORY
  }

  setInventory(inventory: Inventory) {
    this.inventory = inventory;
  };

  setMoney(money: number) {
    this.money = money;
  };

  setTargetPosition(target: { x: number, y: number } | ICity) {

  }

  takeDamage(damage: number) {
    this.health -= damage;
    //TODO: SHOULD HAVE EFFECTS TO CHANGE THE UI BASED ON DAMAGE
  };

  heal(heal: number) {
    this.health += heal;
  };

  travelTo(city: { x: number, y: number }) {
    //travelling logic
    this.position.x = city.x;
    this.position.y = city.y;
  };

  setSpeed(speed: number) {
    //set speed based on the inventory
    this.speed = speed;
  }

}
