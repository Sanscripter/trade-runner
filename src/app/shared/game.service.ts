import { Injectable } from '@angular/core';
import { Game } from '../game/Game';
import { Player } from '../game/Player';
import { Item } from '../game/Item';
import ICity from '../utils/ICity.interface';
import { Inventory } from '../game/Inventory';
import * as LocationsConfig from '../game/configs/locations.json';
import * as ItemsConfig from '../game/configs/items.json';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  game!: Game;
  player!: Player;
  day: number = 1;
  daysLimit: number = 30;
  cities: ICity[] = LocationsConfig.locations;

  startGame(playerName: string) {
    this.player = new Player(playerName, 1000);
    const bread = new Item('Bread', 5, 'A loaf of bread', 10);
    const tent = new Item('Tent', 1000, 'A warm, blood-soaked tent', 1);
    const spear = new Item('Spear', 500, 'A sharp, pointy stick', 1);
    const car = new Item('Personal Car', 10000, 'A great means of transportation', 1);
    this.player.inventory.addItem(bread);
    this.player.inventory.addItem(tent);
    this.player.inventory.addItem(spear);
    this.player.inventory.addItem(car);
    this.cities.forEach((city) => {
      const inventory = new Inventory();
      city?.inventory?.items?.forEach((itemRef: any) => {
        const item = ItemsConfig.items.find((i: any) => i.id === itemRef.id)!;
        inventory.addItem(new Item(item.name, item.value, item.description, itemRef.quantity));
      });
      city.inventory = inventory;
    });
    this.game = new Game(this.player);
  };

  // trade(item: Item, city: ICity) {
  //   this.player.inventory.removeItem(item);
  //   this.player.inventory.addItem(city.inventory.items[0]);
  //   city.inventory.removeItem(city.inventory.items[0]);
  // };

  getCurrentDay() {
    return this.day;
  };

  advanceDay() {
    this.day++;
  };

  isGameOver() {
    return this.day <= this.daysLimit;
  }



}
