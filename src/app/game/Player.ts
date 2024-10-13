import ILocation from "./ILocation.interface";
import { Inventory } from "./Inventory";

export interface IPlayerConfig {
  name: string;
  money: number;
  health: number;
  position: { x: number, y: number };
  attributes?: IAttributes;
  currentStats?: IStats;
  inventory?: Inventory;
}

export interface IAttributes {
  // attributes (0 - 10)
  resilience: number;
  insight: number;
  scoundrel: number;
}

export interface IStats {
  health: number;
  hunger: number;
  thirst: number;
  speed: number;
  vice: number;
}

export interface IStatModifier {
  type: 'item' | 'event';
  name: string;
  description: string;
}


// TODO: REVIEW TO CREATE A GENERAL CHARACTER CLASS
export class Player {
  
  name: string = "Player";
  attributes!: IAttributes;

  //Stats
  maxStats!: IStats;
  currentStats!: IStats;


  // static modifiers
  statsModifiers: Map<IStatModifier,IStats> = new Map();


  // changes frequently
  inventory: Inventory = new Inventory();
  money: number;  
  position: { x: number, y: number } = { x: 70, y: 70 };


  constructor(playerConfig: IPlayerConfig) {
    
    this.name = playerConfig.name;
    this.money = playerConfig.money;
    this.position = playerConfig.position;
    
    if (playerConfig.inventory) {
      this.inventory = playerConfig.inventory;
    }

    if (playerConfig.attributes) {
      this.attributes = playerConfig.attributes;
    } 

    this.computeMaxStats();

    if (playerConfig.currentStats) {
      this.currentStats = playerConfig.currentStats;
    }

    
    

  }

  computeMaxStats() {
    // COMPUTE STATS BASED ON ATTRIBUTES
    this.maxStats = {
      health: this.attributes?.resilience * 10,
      hunger: 100,
      thirst: 100,
      vice: this.attributes?.scoundrel * 10,
      speed: 10
    }
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

  setTargetPosition(target: { x: number, y: number } | ILocation) {

  }

  takeDamage(damage: number) {
    this.currentStats.health -= damage;
    //TODO: SHOULD HAVE EFFECTS TO CHANGE THE UI BASED ON DAMAGE
  };

  heal(heal: number) {
    this.currentStats.health += heal;
  };

  travelTo(city: { x: number, y: number }) {
    //travelling logic
    this.position.x = city.x;
    this.position.y = city.y;
  };

  setSpeed(speed: number) {
    //set speed based on the inventory
    this.currentStats.speed = speed;
  }

}
