import ICity from "../utils/ICity.interface";
import { EFFECT_TYPES } from "./Effect_Types.enum";
import { Item } from "./Item";
import { Player } from "./Player";

export class EventEffect {
  name?: string;
  description?: string;
  type: EFFECT_TYPES;
  subject: Player | ICity | Item;

  constructor(type: EFFECT_TYPES, subject: Player | ICity | Item, name?: string, description?: string) {
    this.type = type;
    this.subject = subject;
    this.name = name ;
    this.description = description;
  }
}
