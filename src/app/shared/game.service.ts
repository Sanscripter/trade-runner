import { Injectable } from '@angular/core';
import { Game } from '../game/Game';
import { Player } from '../game/Player';
import { Item } from '../game/Item';
import ICity from '../utils/ICity.interface';
import { Inventory } from '../game/Inventory';
import * as LocationsConfig from '../game/configs/locations.json';
import * as ItemsConfig from '../game/configs/items.json';
import * as GameEventsConfig from '../game/configs/game_events.json';
import { ENDINGS } from '../game/Endings.enum';
import { EFFECT_TYPES } from '../game/Effect_Types.enum';
import { GameEvents as GameEvent } from '../game/GameEvents';

const PRICE_IMPACT = {
  [EFFECT_TYPES.SCARCITY]: 1.3,
  [EFFECT_TYPES.EXCESS]: 0.4,
  [EFFECT_TYPES.POVERTY]: 0.25,
  [EFFECT_TYPES.ABUNDANCE]: 2,
  [EFFECT_TYPES.CITY_BUYING_X]: 1.5,
  [EFFECT_TYPES.CITY_SELLING_X]: 0.3,
  'default': 0.8
}


@Injectable({
  providedIn: 'root'
})
export class GameService {

  game!: Game;
  player!: Player;
  day: number = 1;
  daysLimit: number = 30;
  dailyEventLimit: number = 5;
  cities: ICity[] = [];
  activeEvents: GameEvent[] = [];
  _eventLog: GameEvent[] = [];
  configs: any = {};

  startGame(playerName: string) {
    this.configs = {
      ItemsConfig: {...ItemsConfig},
      LocationsConfig: {...LocationsConfig},
      GameEventsConfig: {...GameEventsConfig},
   }

    this.eraseSave();
    this.day = 1;
    this.activeEvents = [];
    this._eventLog = [];
    this.setupPlayer(playerName);
    this.setupCities();
    this.game = new Game(this.player);
    this.player.travelTo(this.cities.find(v=> v.name ==='Gas Station') || this.cities[1]); //TODO: Create choose starting city
    this.saveGame();
  };

  saveGame() {
    const saveDoc = {
      player: this.player,
      day: this.day,
      cities: this.cities,
      activeEvents: this.activeEvents,
      eventLog: this._eventLog,
      game: this.game
    };
    localStorage.setItem('saveDoc', JSON.stringify(saveDoc));
  };

  loadGame() {
    const saveDoc = JSON.parse(localStorage.getItem('saveDoc')!);
    if (!saveDoc) {
      return;
    }
    this.player = new Player(saveDoc.player.name, saveDoc.player.money);
    this.player.health = saveDoc.player.health;
    this.player.position = saveDoc.player.position;
    this.player.speed = saveDoc.player.speed;
    this.player.inventory = new Inventory();
    saveDoc.player.inventory.items.forEach((item: any) => {
      this.player.inventory.addItem(new Item(item.name, item.value, item.description, item.quantity));
    });
    this.day = saveDoc.day;
    this.cities = [];
    saveDoc.cities.forEach((city: any) => {
      const loadedCity = {
        ...city,
        inventory: new Inventory()
      }
      city.inventory.items.forEach((item: any) => {
        loadedCity.inventory.addItem(new Item(item.name, item.value, item.description, item.quantity));
      });
      this.cities.push(loadedCity);
    });
    this.activeEvents = saveDoc.activeEvents;
    this._eventLog = saveDoc.eventLog;
    this.game = saveDoc.game;
  }

  eraseSave() {
    localStorage.removeItem('saveDoc');
  }


  playerMoved(position: { x: number, y: number }) {
    const daysTravelled = this.getDaysTravelled(position);
    this.player.travelTo(position);
    this.advanceDay(daysTravelled);
    this.saveGame();
  }

  getDaysTravelled(position: { x: number, y: number }) {
    const distance = Math.sqrt(Math.pow(this.player.position.x - position.x, 2) + Math.pow(this.player.position.y - position.y, 2));
    return Math.ceil(distance / this.player.speed);
  }

  get eventLog() {
    return this._eventLog.reverse();
  }

  get ending() {
    if (this.player.health <= 0) {
      return ENDINGS.DIED;
    }
    if (this.player.money >= 1000000) {
      return ENDINGS.RICH;
    }
    if (this.player.money >= 50000) {
      return ENDINGS.PAID;
    }
    return ENDINGS.INSOLVENT;
  };

  setupCities() {
    this.cities = this.configs.LocationsConfig?.locations.map((location: ICity) => {
      const newLocation = {
        ...location,
        inventory: new Inventory()
      };
      location.inventory?.items?.forEach((itemRef: any) => {
        const item = this.configs.ItemsConfig?.items.find((i: any) => i.id === itemRef.id)!;
        newLocation.inventory.addItem(new Item(item.name, item.value, item.description, itemRef.quantity));
      });
      return newLocation;
    });
  };

  setupPlayer(playerName: string) {
    this.player = new Player(playerName, 1000);
    const bread = new Item('Bread', 5, 'A loaf of bread', 10, 7);
    const tent = new Item('Tent', 1000, 'A warm, blood-soaked tent', 1, 1006);
    const spear = new Item('Spear', 500, 'A sharp, pointy stick', 1, 1010);
    const car = new Item('Personal Car', 10000, 'A great means of transportation', 1, 1011);
    this.player.inventory.addItem(bread);
    this.player.inventory.addItem(tent);
    this.player.inventory.addItem(spear);
    this.player.inventory.addItem(car);
  };

  getCurrentDay() {
    return this.day;
  };

  produceMoreItems() {
    this.cities.forEach((city) => {
      const amountOfNewItems = Math.floor(Math.random() * 10);
      for (let i = 0; i < amountOfNewItems; i++) {
        const item = ItemsConfig.items[Math.floor(Math.random() * ItemsConfig.items.length)];
        const newItem = new Item(item.name, item.value, item.description, Math.ceil(Math.random() * 10));
        city.inventory.addItem(newItem);
      }
    });
  }

  advanceDay(daysTravelled: number) {
    this.day += (daysTravelled ?? 1);
    console.log('Day', this.day);
    try {
      this.produceMoreItems();
      this.generateEvents();
    } catch (e) {
      console.error('Error generating events', e);
    }
    this.saveGame();
  };

  generateEvents() {
    const todayEventCount = Math.floor(Math.random() * this.dailyEventLimit + 1);
    if (this.activeEvents.length > 0 && this.day % 2 === 0) {
      this.activeEvents.splice(this.activeEvents.length - 1, 1);
    }
    for (let i = 0; i < todayEventCount; i++) {
      let eventConfig = GameEventsConfig?.events[Math.floor(Math.random() * GameEventsConfig.events.length)];
      let event = new GameEvent(eventConfig, this.day);
      this.proccessEventEffect(event);
      this._eventLog.push(event);
      this.saveGame();
    }
  };

  proccessEventEffect(event: GameEvent) {
    let subject: ICity | Item | Player | undefined;
    let target: ICity | Item | Player | undefined;
    let effect = event.effect;
    if (effect.type === EFFECT_TYPES.POVERTY || effect.type === EFFECT_TYPES.ABUNDANCE) {
      subject = this.cities[Math.floor(Math.random() * this.cities.length)];
      this.activeEvents = this.activeEvents.filter((e) => !((e.effect.subject?.name === subject?.name) && (e.effect.type === EFFECT_TYPES.POVERTY ? e.effect.type === EFFECT_TYPES.ABUNDANCE : e.effect.type === EFFECT_TYPES.POVERTY)));
    } else if (effect.type === EFFECT_TYPES.SCARCITY || effect.type === EFFECT_TYPES.EXCESS) {
      const index = Math.floor(Math.random() * ItemsConfig.items.length)
      subject = ItemsConfig.items[index];

      this.activeEvents = this.activeEvents.filter((e) => !((e.effect.subject?.name === subject?.name) && (e.effect.type === EFFECT_TYPES.SCARCITY ? e.effect.type === EFFECT_TYPES.EXCESS : e.effect.type === EFFECT_TYPES.SCARCITY)));
    } else if (effect.type === EFFECT_TYPES.CITY_BUYING_X || effect.type === EFFECT_TYPES.CITY_SELLING_X) {
      subject = this.cities[Math.floor(Math.random() * this.cities.length)];
      target = ItemsConfig.items[Math.floor(Math.random() * ItemsConfig.items.length)];
      const qty = Math.ceil((effect.type === EFFECT_TYPES.CITY_BUYING_X ? 1 : 20) * Math.random() + 2);
      const seedItem = new Item(target.name, target.value, target?.description, qty, target.id);
      subject.inventory.addItem(seedItem);
      this.activeEvents = this.activeEvents.filter((e) => !((e.effect.subject?.name === subject?.name) && (e.effect.type === EFFECT_TYPES.CITY_BUYING_X ? e.effect.type === EFFECT_TYPES.CITY_SELLING_X : e.effect.type === EFFECT_TYPES.CITY_BUYING_X)));
    }
    effect = {
      ...effect,
      subject: subject,
      target: target
    };
    if(!effect.subject) {
      console.log('THIS IS THE MISSING SUBJECT', subject);
      console.log('effect', effect);
      console.log('target', target);
    }
    event.setEffect(effect);
    this.activeEvents.push(event);
  }

  isGameOver() {
    return this.player.health <= 0 || this.day >= this.daysLimit;
  };

  resetGame() {
    this.day = 0;
  };

  getCurrentLocalEconomy(location: ICity) {
    const relevantEvents = this.activeEvents.filter((event) => {
      let effect = event.effect;
      return effect.subject === location || [EFFECT_TYPES.SCARCITY, EFFECT_TYPES.EXCESS].includes(effect.type);
    });
    this.updateLocationPrices(location, relevantEvents);
    this.upstatePlayerPrices(relevantEvents);
    this.reflectEconomicStatus(location, relevantEvents);
    return location;
  }

  updateLocationPrices(location: ICity, relevantEvents: GameEvent[]) {
    location.inventory.items.forEach((item: Item) => {
      const effect = relevantEvents.find(e => e.effect.subject === item && e.effect.subject.id === item.id)?.effect;
      const priceImpact = effect?.type === EFFECT_TYPES.SCARCITY ? 1.3 : effect?.type === EFFECT_TYPES.EXCESS ? 0.4 : 0.8;
      item.cost = item.value * (priceImpact + Math.random() + 0.01);
    });
  }

  upstatePlayerPrices(relevantEvents: GameEvent[]) {
    this.player.inventory.items.forEach((item: Item) => {
      const effect = relevantEvents.find(e => e.effect.subject === item && e.effect.subject.id === item.id)?.effect;
      const priceImpact = effect?.type === EFFECT_TYPES.SCARCITY ? 1.3 : effect?.type === EFFECT_TYPES.EXCESS ? 0.4 : 0.8;
      item.cost = item.value * (priceImpact + Math.random());
    });
  }

  reflectEconomicStatus(location: ICity, relevantEvents: GameEvent[]) {
    if (relevantEvents.find(e => e.effect.type === EFFECT_TYPES.CITY_BUYING_X)) {
      let playerItem = this.player.inventory.items.find((item: Item) => item.id === relevantEvents.find(e => e.effect.type === EFFECT_TYPES.CITY_BUYING_X)?.effect.target?.id);
      playerItem!.cost = playerItem?.cost! * (1.5 + Math.random()) + 0.01;
      let locationItem = location.inventory.items.find((item: Item) => item.id === relevantEvents.find(e => e.effect.type === EFFECT_TYPES.CITY_BUYING_X)?.effect.target?.id);
      locationItem!.cost = locationItem?.cost! * (1.9 + Math.random()) + 0.01;
    }
    if (relevantEvents.find(e => e.effect.type === EFFECT_TYPES.CITY_SELLING_X)) {
      let event = relevantEvents.find(e => e.effect.type === EFFECT_TYPES.CITY_SELLING_X)!;
      let relevantItem = ItemsConfig.items.find((item: Item) => item.id === event.effect.target?.id)
      let playerItem = this.player.inventory.items.find((item: Item) => item.id === relevantItem?.id);
      playerItem!.cost = playerItem?.cost! * (0.3 + Math.random()) + 0.01;
      let locationItem = location.inventory.items.find((item: Item) => item.id === relevantItem?.id);
      let cost = relevantItem?.value! * (0.5 + Math.random()) + 0.01;
      let qty = Math.ceil(5 * Math.random() + 2);
      if (!locationItem) {
        let excessItem = new Item(relevantItem?.name!, cost, relevantItem?.description!, qty, relevantItem?.id!);
        location.inventory.addItem(excessItem);
      }
      locationItem!.cost = cost;
      locationItem!.quantity = locationItem!.quantity! + qty;
    }
    if (relevantEvents.find(e => e.effect.type === EFFECT_TYPES.POVERTY)) {
      location.inventory.items.forEach((item: Item) => {
        item.cost = item.value * (0.25 + Math.random());
      });
      this.player.inventory.items.forEach((item: Item) => {
        item.cost = item.value * (1.25 + Math.random());
      });
      location.money = location.size * 500 * (0.5 + Math.random());
    }
    if (relevantEvents.find(e => e.effect.type === EFFECT_TYPES.ABUNDANCE)) {
      location.inventory.items.forEach((item: Item) => {
        item.cost = item.value * (2 + Math.random());
      });
      this.player.inventory.items.forEach((item: Item) => {
        item.cost = item.value * (0.5 + Math.random());
      });
      location.money = location.size * 2000 * (2 + Math.random());
    }

    location.money = location.money! + location.money! * 0.30 * (0.5 - Math.random());
  }

}
