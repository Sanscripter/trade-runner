import { Character, ICharacterConfig } from './Character';

export interface IPlayerConfig extends ICharacterConfig {}

export class Player extends Character {
  constructor(playerConfig: IPlayerConfig) {
    super(playerConfig);
  }

  get stealingChance() {
    return 0.5; // TODO: Add logic to calculate stealing chance based on stats and inventory
  }
}
