import { ChangeDetectorRef, Component, OnInit  } from '@angular/core';
import ICity from '../utils/ICity.interface';
import { Router } from '@angular/router';
import { GameService } from '../shared/game.service';
import { Player } from '../game/Player';
import { SoundService } from '../shared/sound.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  player!: Player;
  inventoryOpen = false;
  locationHovered!: ICity | null;

  constructor(private router: Router,public gameService: GameService, private cdr: ChangeDetectorRef, private soundService: SoundService) { }

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
    if(this.locationHovered?.id !== city.id) {
      this.locationHovered = city;
      this.soundService.playSound('LOCATION_HOVER');
    }
    this.cdr.detectChanges();
  }

}
