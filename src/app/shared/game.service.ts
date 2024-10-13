import { Injectable } from '@angular/core';
import { Game } from '../game/Game';
import { Inventory } from '../game/Inventory';
import * as LocationsConfig from '../game/configs/locations.json';
import * as ItemsConfig from '../game/configs/items.json';
import * as GameEventsConfig from '../game/configs/game_events.json';
import { JsonSerializer } from 'typescript-json-serializer';


//TODO: EXTRACT 
const DEFAULT_PLAYER_CONFIG =  {
  money: 5000,
  position: { x: 0, y: 0 },
  inventory: new Inventory(),
  attributes: {
    resiliance: 5,
    insight: 5,
    scoundrel: 5
  },
  currentStats: {
    health: 5,
    hunger: 100,
    thirst: 100,
    vice: 0,
    speed: 10
  }
};

@Injectable()
export class GameService {

  game!: Game;
  
  serializer = new JsonSerializer();
  gameState: any = null; //if game is null, start a new game

  startGame(playerName: string) {
    this.game = new Game({
      ItemsConfig: {...ItemsConfig},
      LocationsConfig: {...LocationsConfig},
      GameEventsConfig: {...GameEventsConfig},
      PlayerConfig: {
        ...DEFAULT_PLAYER_CONFIG,
        name: playerName,
      }
    });
    this.saveGame();
  };

  saveGame() {
    if (!this.game || !this.serializer) {
      console.error('Game or serializer not initialized');
      return;
    }
    const gameState = this.serializer.serialize(this.game);
    localStorage.setItem('gameState', JSON.stringify(gameState));
  };

  loadGame() {
    this.gameState = localStorage.getItem('gameState');
    if (!this.gameState) {
      console.error('No game state found');
      return;
    }
    // this.game = this.serializer.deserialize(JSON.parse(this.gameState), Game) as Game;
  }

  eraseSave() {
    localStorage.removeItem('gameState');
  }  

}
