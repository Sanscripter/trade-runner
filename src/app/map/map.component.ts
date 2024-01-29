import { Component, OnInit } from '@angular/core';
import ICity from '../utils/ICity.interface';
import { Router } from '@angular/router';
import { GameService } from '../shared/game.service';
import { Player } from '../game/Player';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  player!: Player;

  constructor(private router: Router,public gameService: GameService) { }

  ngOnInit() {
    this.player = this.gameService.player;
  }

  handleTravelling(city: ICity) {
    this.router.navigate([`location`], {
      queryParams: {
        id: city.id
      }
    });
  }

}
