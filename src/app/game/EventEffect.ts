import ICity from "../utils/ICity.interface";
import { EFFECT_TYPES } from "./Effect_Types.enum";
import { Item } from "./Item";
import { Player } from "./Player";

export class EventEffect {
  name?: string;
  _description?: string;
  type: EFFECT_TYPES;
  subject: Player | ICity | Item;
  target?: Player | ICity | Item;

  constructor(type: EFFECT_TYPES, subject: Player | ICity | Item, target?: ICity | Player | Item, name?: string, description?: string) {
    this.type = type;
    this.subject = subject;
    this.name = name || `${type}_${subject.id}`;
    this._description = description;
    if (target) {
      this.target = target;
    }
  }

  get description() {
    return this._description?.replace(/{{subject}}/g, this.subject.name).replace(/{{target}}/g, this.target?.name || '');
  }
}
