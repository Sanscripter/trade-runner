export class GameEvent {
  description!: string;
  day!: number;
  effect: any;

  constructor(eventConfig: any, day: number) {
    this.day = day;
    this.description = eventConfig?.description;
    this.effect = eventConfig?.effect;
  }

  setEffect(effect: any) {
    this.effect = effect;
    const subject = this.effect.subject;
    const target = this.effect.target;
    this.description = this.description.replace(/{{subject}}/g, subject.name).replace(/{{target}}/g, target?.name);
  }
}
