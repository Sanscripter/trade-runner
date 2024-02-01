import { Injectable } from '@angular/core';
import { Game } from '../game/Game';
import { Player } from '../game/Player';
import { Item } from '../game/Item';
import ICity from '../utils/ICity.interface';
import { Inventory } from '../game/Inventory';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  game!: Game;
  player!: Player;
  day: number = 1;
  daysLimit: number = 30;
  cities: ICity[] = [
    { id: 1,
      x: 50,
      y: 50,
      size: 1,
      name: "Corey's \nHouse",
      money: 200,
      traderMugshot: "assets/mugs/corey.png",
      background: "assets/backgrounds/coreys_house.png",
      description: "A rundown suburban family home, crumbling drywall and broken windows spread around a boy with a deadly smile.",
      barks: ["I liked it better underground, when the corpses were just burned."]
    },
    { id: 2,
      x: 750,
      y: 400,
      size: 20,
      name: "Viana's \nGrange",
      money: 8000,
      background: "assets/backgrounds/vianas_grange.png",
    },
    { id: 3,
      x: 500,
      y: 100,
      size: 30,
      name: "BUY USED TV \nSETS NOW!1!!",
      money: 10000
    },
    { id: 4,
      x: 800,
      y: 500,
      size: 100,
      name: "Fort Lieber",
      money: 500000,
      traderMugshot: "assets/mugs/cpt_measly.png",
      background: "assets/backgrounds/fort_lieber.png",
      barks: ["I'm watching you, trader scum."]
    },
    { id: 5,
      x: 250,
      y: 400,
      size: 40,
      name: "Paradize",
      money: 40000,
      traderMugshot: "assets/mugs/dullard_cult.png",
      background: "assets/backgrounds/paradize.png",
      barks: ["We'll ~massage~ the brain out of your skull, if you like. "]
    },
    { id: 6,
      x: 350,
      y: 100,
      size: 40,
      name: "Wind Autunm",
      money: 5000
    },
    { id: 7,
      x: 600,
      y: 450,
      size: 40,
      name: "Unknown",
      money: 20000
    },
    { id: 8,
      x: 450,
      y: 300,
      size: 40,
      name: "El Asco",
      money: 10000,
      traderMugshot: "assets/mugs/pablo_pueblo.png",
      background: "assets/backgrounds/el_asco.png",
      barks: ["Hola, trader. Pick your poison. Mine is ennui."]
    },
  ];

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
      city.inventory = new Inventory();
      city.inventory.addItem(new Item('Smugleaf', 5, 'Looks edible', 10));
      city.inventory.addItem(new Item('Ploshad', 8000, 'A horse, only more so', 1));
      city.inventory.addItem(new Item('Pistol', 4000, '"Freedom" tool', 1));
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

  timesUp() {
    return this.day <= this.daysLimit;
  }

}
