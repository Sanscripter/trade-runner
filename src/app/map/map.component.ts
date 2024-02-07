import { Component, OnInit } from '@angular/core';
import ICity from '../utils/ICity.interface';
import { Router } from '@angular/router';
import { GameService } from '../shared/game.service';
import { Player } from '../game/Player';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  player!: Player;
  inventoryOpen = false;

  constructor(private router: Router,public gameService: GameService) { }

  ngOnInit() {
    this.gameService.loadGame();
    this.player = this.gameService.player;
    if (this.gameService.isGameOver()) {
      this.router.navigate(['end']);
    }
  }

  toggleInventory() {
    this.inventoryOpen = !this.inventoryOpen;
  }

  handleTravelling(city: ICity) {
    this.router.navigate([`location`], {
      queryParams: {
        id: city.id
      }
    });
  }

}
