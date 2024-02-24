import { Player } from "./Player";
import { World } from "./World";

export class Game {
  _player: Player;
  _world: World;
  _day = 1;
  _daysLimit = 30;


  constructor(player: Player, world: World) {
    this._player = player;
    this._world = world;
  }

  get day() {
    return this._day
  }

  advanceDay() {
    this._day++;
  }
}
