import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../shared/game.service';
import ICity from '../../utils/ICity.interface';
import { Inventory } from '../../game/Inventory';
import { Player } from '../../game/Player';
import { Item } from '../../game/Item';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent implements OnInit {

  locationId!: number;
  playerSells = new Inventory();
  traderSells = new Inventory();
  tradeMode = false;
  notEnoughMoney = false;
  tradeEnabled = true;
  lackOfFunds = false;
  stealSucces = false;
  stealFailed = false;
  stealMode = false;

  constructor(private router: Router, private route: ActivatedRoute, public gameService: GameService) { }

  ngOnInit() {
    this.gameService.loadGame();
    this.route.queryParams.subscribe((qp: any) => {
      this.locationId = qp['id'];
    });
    this.trader = this.gameService.getCurrentLocalEconomy(this.trader);
  }

  get player() {
    return this.gameService.player;
  };

  get trader() {
    return this.gameService.cities.find(c => c.id == this.locationId)!;
  };

  set trader(trader: ICity) {
    this.gameService.cities = this.gameService.cities.map(c => c.id === trader.id ? trader : c);
  };

  get bark() {
    return this.trader.barks![Math.floor(Math.random() * this.trader.barks!.length)];
  }

  get playerInventory() {
    return Object.assign({}, this.player.inventory);
  }

  get traderInventory() {
    return Object.assign({}, this.trader.inventory);
  }

  handleGoBack() {
    this.gameService.advanceDay();
    if (this.gameService.isGameOver()) {
      this.router.navigate(['end']);
      return;
    }
    this.router.navigate(['map']);
  }

  handlePlayerSell(event: any) {
    this.playerSells.updateItem(event);
    this.checkTrade();
  }

  handleTraderSell(event: any) {
    this.traderSells.updateItem(event);
    this.checkTrade();
  }

  checkTrade() {
    this.tradeEnabled = true;
    this.notEnoughMoney = false;
    this.lackOfFunds = false;
    const playerValue = this.playerSells.totalValue;
    const traderValue = this.traderSells.totalValue;
    if (playerValue > (this.trader.money! + traderValue)) {
      this.lackOfFunds = true;
      this.tradeEnabled = false;
      return;
    }
    if (traderValue > (this.player.money! + playerValue)) {
      this.notEnoughMoney = true;
      this.tradeEnabled = false;
      return;
    }
  }

  startTrade() {
    this.tradeMode = true;
  }

  startStealing() {
    this.stealMode = true;
  }

  handleStealing() {
    this.stealMode = true;
    if (true){
      const randomItem = this.trader.inventory!.items[Math.ceil(Math.random() * this.trader.inventory!.items.length-1)] as Item;
      console.log('random',randomItem);
      const randomQty = Math.ceil(randomItem.quantity! * Math.random());
      console.log('randomQty',randomQty);
      randomItem.quantity = randomQty;
      const stolenItem = new Item(randomItem.name, randomItem?.cost!, randomItem.description, randomQty);
      this.player.inventory.addItem(stolenItem);
      this.trader.inventory!.removeItem(stolenItem);
      this.stealSucces = true;
      this.stealMode = false;
    } else {
      this.player.takeDamage(Math.ceil(this.trader.size! * Math.random()/2));
      this.stealFailed = true;
      if (this.player.health <= 0) {
        this.router.navigate(['end']);
      }
    }

  }

  handleTrade() {
    //If it's positive add to player wallet and remove from trader wallet
    //If it's negative do the opposite
    const netTrasactionValue = this.playerSells.totalValue - this.traderSells.totalValue;
    netTrasactionValue > 0 ? this.transferMoney(this.trader, this.player, netTrasactionValue) : this.transferMoney(this.player, this.trader, -netTrasactionValue);
    // trasfer items
    this.playerSells.items.forEach(item => {
      this.player.inventory.removeItem(item);
      this.trader.inventory!.addItem(item);
    });
    this.traderSells.items.forEach(item => {
      this.trader.inventory!.removeItem(item);
      this.player.inventory.addItem(item);
    });
    this.playerSells.items = [];
    this.traderSells.items = [];
    this.player.inventory.items = this.player.inventory.items.slice(0);
    this.trader.inventory!.items = this.trader.inventory!.items.slice(0);
    this.tradeMode = false;
  }

  transferMoney(from: Player | ICity, to: Player | ICity, amount: number) {
    const contrainedValue = Math.min(from.money!, amount);
    from.money! -= contrainedValue;
    to.money! += contrainedValue;
  }

  cancelMode() {
    this.tradeMode = false;
    this.notEnoughMoney = false;
    this.stealMode = false;
    this.stealSucces = false;
    this.stealFailed = false;
    this.enableTrade();
    this.playerSells.items = [];
    this.traderSells.items = [];
  }

  enableTrade() {
    this.tradeEnabled = true;
    this.lackOfFunds = false;
  }

}
