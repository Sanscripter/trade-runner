import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GameService } from '../../shared/game.service';
import ICity from '../../utils/ICity.interface';
import { Item } from '../../game/Item';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent implements OnInit {

  locationId!: number;
  location!: ICity;
  tradeBasket: Record<string,Array<Item>> = {playerSells: [], locationSells: []};

  constructor(private router: Router, private route: ActivatedRoute, public gameService: GameService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(qp => {
      this.locationId = qp['id'];
      this.location = this.gameService.cities.find(c => c.id == this.locationId)!;
    });
  }

  handleGoBack() {
    this.gameService.advanceDay();
    this.router.navigate(['map']);
  }

 handleAddedPlayer(item: Item){
  //if the item is already in the array, don't increase the quantity
  const existingItem = this.tradeBasket['playerSells'].find(i => i.name == item.name);
  if (existingItem) {
    existingItem.quantity!++;
  }
  else {
    this.tradeBasket['playerSells'].push(item);
  }
 }

 handleRemovedPlayer(item:Item){
  const existingItem = this.tradeBasket['playerSells'].find(i => i.name == item.name);
  if (existingItem) {
    existingItem.quantity!--;
  }
  else {
    this.tradeBasket['playerSells'].push(item);
  }
 }
 handleAddedLocation(item: Item){
  const existingItem = this.tradeBasket['locationSells'].find(i => i.name == item.name);
  if (existingItem) {
    existingItem.quantity!++;
  }
  else {
    this.tradeBasket['locationSells'].push(item);
  }
 }
 handleRemovedLocation(item: Item){
  const existingItem = this.tradeBasket['locationSells'].find(i => i.name == item.name);
  if (existingItem) {
    existingItem.quantity!--;
  }
  else {
    this.tradeBasket['locationSells'].push(item);
  }
 }

}
