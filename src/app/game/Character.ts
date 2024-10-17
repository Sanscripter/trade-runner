import ILocation from './ILocation.interface';
import { Inventory } from './Inventory';

export interface ICharacterConfig {
  name: string;
  money: number;
  position: { x: number; y: number };
  attributes?: IAttributes;
  currentStats?: IStats;
  inventory?: Inventory;
}

export interface IAttributes {
  // attributes (0 to 10)
  resilience: number;
  insight: number;
  scoundrel: number;
}

// TODO: UI FOR HEALTH LOST AND MAX
export interface IStats {
  health: {
    max: number;
    value: number;
  };
  hunger: {
    max: number;
    value: number;
  };
  thirst: {
    max: number;
    value: number;
  };
  speed: {
    max: number;
    value: number;
  };
  vice: {
    max: number;
    value: number;
  };
}

export interface IStatModifier {
  type: 'item' | 'event';
  name: string;
  description: string;
}

export class Character {
  name: string;
  attributes!: IAttributes;
  baseStats!: IStats;
  currentStats!: IStats;
  statsModifiers: Map<IStatModifier, IStats> = new Map();
  inventory: Inventory = new Inventory();
  money: number;
  position: { x: number; y: number };

  constructor(config: ICharacterConfig) {
    this.name = config.name;
    this.money = config.money;
    this.position = config.position;

    if (config.inventory) {
      this.inventory = config.inventory;
    }

    if (config.attributes) {
      this.attributes = config.attributes;
    }

    this.computeBaseStats();

    if (config.currentStats) {
      this.currentStats = config.currentStats;
    }
  }

  computeBaseStats() {
    this.baseStats = {
      health: {
        value: this.attributes?.resilience * 10,
        max: this.attributes?.resilience * 10,
      },
      hunger: {
        value: 100,
        max: 100,
      },
      thirst: {
        value: 100,
        max: 100,
      },
      vice: {
        value: 0,
        max: 0,
      },
      speed: {
        value: 50,
        max: 50,
      },
    };
  }

  takeDamage(damage: number) {
    this.currentStats.health.value -= damage;
  }

  heal(heal: number) {
    this.currentStats.health.value = Math.min(
      this.currentStats.health.value + heal,
      this.currentStats.health.max
    );
  }

  setInventory(inventory: Inventory) {
    this.inventory = inventory;
  }

  setMoney(money: number) {
    this.money = money;
  }

  setTargetPosition(target: { x: number; y: number } | ILocation) {
    // Set position logic
  }

  travelTo(location: { x: number; y: number }) {
    this.position.x = location.x;
    this.position.y = location.y;
  }

  setSpeed(speed: number) {
    this.currentStats.speed.value = Math.min(
      speed,
      this.currentStats.speed.max
    );
  }
}
