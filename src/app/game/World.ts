import { Map } from "./Map";
import { Trader } from "./Trader";

export class World {
  _map: Map
  _traders: Trader[]

  constructor(map: Map, traders: Trader[]) {
    this._map = map;
    this._traders = traders;
  }


}
