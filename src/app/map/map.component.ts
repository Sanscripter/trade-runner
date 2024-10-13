import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import ILocation from '../game/ILocation.interface';
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
  locationHovered!: ILocation | null;
  fastTravelTo!: ILocation | null;

  @ViewChild('fastTravelConfirmation') fastTravelConfirmation: ElementRef<HTMLDialogElement> | undefined;


  constructor(private router: Router,public gameService: GameService, private cdr: ChangeDetectorRef, private soundService: SoundService) { }

  ngOnInit() {
    this.gameService.loadGame();
    this.player = this.gameService.game.player;


    if (this.gameService.game.isGameOver()) {
      this.router.navigate(['end']);
    }
  }

  toggleInventory() {
    this.inventoryOpen = !this.inventoryOpen;
  }

  handleFastTravelTo(city: ILocation) {
    this.fastTravelTo = city;
    this.fastTravelConfirmation?.nativeElement.showModal();
  }

  handleEnterLocation(city: ILocation) {
    // this.gameService.playerMoved(city);
    this.gameService.game.computeLocationChanges();

    this.router.navigate([`location`], {
      queryParams: {
        id: city.id
      }
    });
  }

  handleFastTravelConfirm() {
    // this.gameService.game.playerMoved(this.fastTravelTo!);
    this.gameService.game.computeLocationChanges();

    this.router.navigate([`travelling`], {
      queryParams: {
        id: this.fastTravelTo!.id
      }
    })
    .finally(() => {
      this.fastTravelTo = null;
      this.fastTravelConfirmation?.nativeElement.close();
    });
  }

  renderLocationInfoCard(city: ILocation | null) {
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
