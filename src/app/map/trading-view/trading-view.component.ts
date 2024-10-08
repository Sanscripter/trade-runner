import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Inventory } from '../../game/Inventory';
import { Item } from '../../game/Item';
import { Player } from '../../game/Player';
import ICity from '../../utils/ICity.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../../shared/game.service';
import { SoundService } from '../../shared/sound.service';

@Component({
  selector: 'app-trading-view',
  templateUrl: './trading-view.component.html',
  styleUrls: ['./trading-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradingViewComponent implements OnInit {

  @Input() trader!: ICity;

  @Output() optionSelected = new EventEmitter<string | null>();

  playerSells = new Inventory();
  traderSells = new Inventory();
  stealableItems: Item[] = [];
  checkingSteal = false;
  tradeMode = false;
  notEnoughMoney = false;
  tradeEnabled = true;
  lackOfFunds = false;
  stealSuccess = false;
  stealFailed = false;
  stealMode = false;
  stolenItem?: Item;

  constructor(private router: Router, public gameService: GameService, private cdr: ChangeDetectorRef, private soundService: SoundService) { }

  ngOnInit() {
  }


  
  get player() {
    return this.gameService.player;
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
   this.optionSelected.emit(null)
    
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
    this.soundService.playSound('TRADE');
  }

  startStealing() {
    this.stealMode = true;
  }

  checkSteal() {
    this.getStealableItems();
    this.checkingSteal = true;
    this.soundService.playSound('EVIL_CUE_1', { playbackRate: 1.8 });
  }

  getStealableItems() {
    //every time we steal,  a few items are available (2)
    const items = this.trader.inventory!.items;
    const randomItems = [];
    for (let i = 0; i < 2; i++) { //TODO: In the future stealable must be defined by relative value and trade personality
      const randomItem = items[Math.floor(Math.random() * items.length)];
      randomItems.push(randomItem);
    }
    this.stealableItems = randomItems;
  }

  handleStealing(index: number) {
    this.stealMode = true;
    if (Math.random() > this.player.stealingChance!){//TODO: In the future stealing chance must be defined by player personality
      const randomItem = this.stealableItems[index];
      console.log('random',randomItem);
      const randomQty = 1; //In the future we can add a random quantity
      this.stolenItem = new Item(randomItem.name, randomItem?.cost!, randomItem.description, randomQty, randomItem.id, randomItem.img);
      this.player.inventory.addItem(this.stolenItem);
      this.trader.inventory!.removeItem(this.stolenItem);
      this.stealSuccess = true;
    } else {
      // this.player.takeDamage(Math.ceil(this.trader.size! * Math.random()/2));
      this.player.takeDamage(1); //TODO: In the future damage must be defined by trader personality, trader size, item value, etc
      this.stealFailed = true;
    }
    this.checkingSteal = false;
    this.gameService.saveGame();
  }

  handleTrade() {
    //If it's positive add to player wallet and remove from trader wallet
    //If it's negative do the opposite
    const netTrasactionValue = this.playerSells.totalValue - this.traderSells.totalValue;
    netTrasactionValue > 0 ? this.transferMoney(this.trader, this.player, netTrasactionValue) : this.transferMoney(this.player, this.trader, -netTrasactionValue);
    // trasfer items
    this.playerSells.items.forEach(item => {
      this.player.inventory!.removeItem(item);
      this.trader.inventory!.addItem(item);
    });
    this.traderSells.items.forEach(item => {
      this.trader.inventory!.removeItem(item);
      this.player.inventory!.addItem(item);
    });
    this.playerSells.items = [];
    this.traderSells.items = [];
    this.player.inventory.items = this.player.inventory.items.slice(0);
    this.trader.inventory!.items = this.trader.inventory!.items.slice(0);
    this.tradeMode = false;
    this.soundService.playSound('TRADE', { playbackRate: 0.8 });
    this.gameService.saveGame();
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
    this.stealSuccess = false;
    this.stealFailed = false;
    this.enableTrade();
    this.playerSells.items = [];
    this.traderSells.items = [];
    this.soundService.playSound('REVERSE_ACTION_CLICK', { playbackRate: 0.8 });
  }

  enableTrade() {
    this.tradeEnabled = true;
    this.lackOfFunds = false;
    this.soundService.playSound('GENERIC_ACTION_CLICK', { playbackRate: 1.5 });
  }


}
