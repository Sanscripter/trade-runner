import { Injectable } from '@angular/core';
import { Game } from '../game/Game';
import { Player } from '../game/Player';
import { Item } from '../game/Item';
import ICity from '../utils/ICity.interface';
import { Inventory } from '../game/Inventory';
import * as LocationsConfig from '../game/configs/locations.json';
import * as ItemsConfig from '../game/configs/items.json';
import { ENDINGS } from '../game/Endings.enum';
import { EventEffect } from '../game/EventEffect';
import { EFFECT_TYPES } from '../game/Effect_Types.enum';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  game!: Game;
  player!: Player;
  day: number = 1;
  daysLimit: number = 30;
  cities: ICity[] = LocationsConfig.locations;
  eventEffects: EventEffect[] = [];

  startGame(playerName: string) {
    this.setupPlayer(playerName);
    this.setupCities();
    this.game = new Game(this.player);
  };

  get ending() {
    if (this.player.health <= 0) {
      return ENDINGS.DIED;
    }
    if (this.player.money <= 1000000) {
      return ENDINGS.RICH;
    }
    if (this.player.money < 100000) {
      return ENDINGS.PAID;
    }
    return ENDINGS.INSOLVENT;
  };

  setupCities() {
    this.cities.forEach((city) => {
      const inventory = new Inventory();
      city?.inventory?.items?.forEach((itemRef: any) => {
        console.log(itemRef);
        console.log(ItemsConfig.items);
        const item = ItemsConfig.items.find((i: any) => i.id === itemRef.id)!;
        inventory.addItem(new Item(item.name, item.value, item.description, itemRef.quantity));
      });
      city.inventory = inventory;
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

  advanceDay() {
    this.day++;
  };

  isGameOver() {
    return this.player.health <= 0 || this.day >= this.daysLimit;
  };

  resetGame() {
    this.day = 0;
  };

  getCurrentLocalEconomy(location: ICity) {
    const relevantEffects = this.eventEffects.filter((effect) => {
     return effect.subject === location || [EFFECT_TYPES.SCARCITY, EFFECT_TYPES.EXCESS].includes(effect.type);
    });
    location.inventory.items.forEach((item: Item) => {
      const effect = relevantEffects.find(e => e.subject === item && e.subject.id === item.id);
      const priceImpact = effect?.type === EFFECT_TYPES.SCARCITY ? 1.3 : effect?.type === EFFECT_TYPES.EXCESS ? 0.4 : 0.8;
      item.cost = item.value * (priceImpact + Math.random());
    });
    this.player.inventory.items.forEach((item: Item) => {
      const effect = relevantEffects.find(e => e.subject === item && e.subject.id === item.id);
      const priceImpact = effect?.type === EFFECT_TYPES.SCARCITY ? 1.3 : effect?.type === EFFECT_TYPES.EXCESS ? 0.4 : 0.8;
      item.cost = item.value * (priceImpact + Math.random());
    });
    if (relevantEffects.find(e => e.type === EFFECT_TYPES.POVERTY)) {
      location.inventory.items.forEach((item: Item) => {
        item.cost = item.value * (0.25 + Math.random());
      });
      this.player.inventory.items.forEach((item: Item) => {
        item.cost = item.value * (1.25 + Math.random());
      });
      location.money = location.size * 1000 * (0.5 + Math.random());
    }
    if (relevantEffects.find(e => e.type === EFFECT_TYPES.ABUNDANCE)) {
      location.inventory.items.forEach((item: Item) => {
        item.cost = item.value * (2 + Math.random());
      });
      this.player.inventory.items.forEach((item: Item) => {
        item.cost = item.value * (0.5 + Math.random());
      });
      location.money = location.size * 2000 * (2 + Math.random());
    }
    location.money = location.money! + location.money! * 0.30 * (0.5 - Math.random());
    return location;
  }

}
