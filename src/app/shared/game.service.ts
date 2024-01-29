import { Injectable } from '@angular/core';
import { Game } from '../game/Game';
import { Player } from '../game/Player';
import { Item } from '../game/Item';
import ICity from '../utils/ICity.interface';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  game!: Game;
  player!: Player;
  day: number = 1;
  cities: ICity[] = [
    { id: 1, x: 50,  y: 50,  size: 1, name: "Corey's \nHouse" },
    { id: 2, x: 750, y: 400, size: 20, name: "Viana's \nGrange" },
    { id: 3, x: 500, y: 100, size: 30, name: "BUY USED TV \nSETS NOW!1!!" },
    { id: 4, x: 800, y: 500, size: 100, name: "Fort Lieber" },
    { id: 5, x: 250, y: 400, size: 40, name: "Paradize" },
    { id: 6, x: 350, y: 100, size: 40, name: "Wind Autunm" },
    { id: 7, x: 600, y: 450, size: 40, name: "Unknown" },
    { id: 8, x: 450, y: 300, size: 40, name: "El Asco" },
  ];

  startGame(playerName: string) {
    this.player = new Player(playerName, 1000);
    const bread = new Item('Bread', 5, 'A loaf of bread', 10);
    const tent = new Item('Tent', 1000, 'A warm, blood-soaked tent');
    const spear = new Item('Spear', 500, 'A sharp, pointy stick');
    const car = new Item('Car', 10000, 'A great means of transportation');
    this.player.inventory.addItem(bread);
    this.player.inventory.addItem(tent);
    this.player.inventory.addItem(spear);
    this.player.inventory.addItem(car);
    this.game = new Game(this.player);
  };

  getCurrentDay() {
    return this.day;
  };

  advanceDay() {
    this.day++;
  };

}
