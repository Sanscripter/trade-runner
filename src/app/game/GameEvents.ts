import { EventEffect } from "./EventEffect";

export class GameEvents {
  _description!: string;
  day!: number;
  effects: EventEffect[] = [];

  constructor(day: number, effects?: EventEffect[]) {
    this.day = day;
    if (effects) {
      this.effects = effects;
    }
  }

  get description() {
    return this._description.replace(/{{subject}}/g, this.effects[0].subject.name).replace(/{{target}}/g, this.effects[0].target?.name || '');
  }

  addEffect(effect: EventEffect) {
    this.effects.push(effect);
  }
}
