import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GameService } from '../../shared/game.service';
import ICity from '../../utils/ICity.interface';
import { Item } from '../../game/Item';
import { Inventory } from '../../game/Inventory';
import { Player } from '../../game/Player';

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

  constructor(private router: Router, private route: ActivatedRoute, public gameService: GameService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(qp => {
      this.locationId = qp['id'];
    });
  }

  get player (){
    return this.gameService.player;
  };

  get trader (){
    return this.gameService.cities.find(c => c.id == this.locationId)!;
  };

  get playerInventory() {
    return Object.assign({},this.player.inventory);
  }

  get traderInventory() {
    return Object.assign({},this.trader.inventory);
  }

  handleGoBack() {
    this.gameService.advanceDay();
    this.router.navigate(['map']);
  }

  handlePlayerSell(event: any) {
    this.playerSells.updateItem(event);
  }

  handleTraderSell(event: any) {
    this.traderSells.updateItem(event);
  }

  startTrade() {
    this.tradeMode = true;
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
    // this.player.inventory = Object.assign({}, this.player.inventory);
    // this.trader.inventory = Object.assign({}, this.trader.inventory);
    // this.player.inventory.items = [...this.player.inventory.items];
    // this.trader.inventory!.items = [...this.trader.inventory!.items];
    // console.log(this.player.inventory.items);
    // console.log(this.trader.inventory!.items);
    this.tradeMode = false;
  }

  transferMoney(from: Player | ICity, to: Player | ICity, amount: number) {
    from.money! -= amount;
    to.money! += amount;
  }

}
