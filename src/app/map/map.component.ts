import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import ICity from '../utils/ICity.interface';
import { Router } from '@angular/router';
import { GameService } from '../shared/game.service';
import { Player } from '../game/Player';
import { LocationInfoCardComponent } from './location-info-card/location-info-card.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  player!: Player;
  inventoryOpen = false;
  locationHovered!: ICity | null;

  constructor(private router: Router,public gameService: GameService, private cdr: ChangeDetectorRef) { }

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
    this.gameService.playerMoved(city);
    this.router.navigate([`travelling`], {
      queryParams: {
        id: city.id
      }
    });
  }

  renderLocationInfoCard(city: ICity | null) {
    if(!city) {
      this.locationHovered = null;
      return;
    }
  
    this.locationHovered = city;
    this.cdr.detectChanges();
  }

}
