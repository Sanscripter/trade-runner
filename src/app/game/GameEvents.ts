export class GameEvents {
  description!: string;
  day!: number;
  effect: any;

  constructor(eventConfig: any, day: number) {
    this.day = day;
    this.description = eventConfig.description;
    console.log('eventConfig', eventConfig);
    this.effect = eventConfig.effect;
  }

  setEffect(effect: any) {
    this.effect = effect;
    const subject = this.effect.subject;
    const target = this.effect.target;
    if(effect.type === 'CITY_BUYING_X' || effect.type === 'CITY_SELLING_X') {
      console.log('effect', effect);
      console.log('subject', subject);
      console.log('target', target);
    }
    this.description = this.description.replace(/{{subject}}/g, subject.name).replace(/{{target}}/g, target?.name);
  }
}
