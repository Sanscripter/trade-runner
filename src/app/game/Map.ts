import { Location } from "./Location";

export class Map {
  _locations: Location[];

  constructor(locations: Location[]) {
    this._locations =locations;
  }
}
