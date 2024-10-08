import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../../shared/game.service';
import { SoundService } from '../../shared/sound.service';

@Component({
  selector: 'app-travelling-view',
  templateUrl: './travelling-view.component.html',
  styleUrls: ['./travelling-view.component.scss']
})
export class TravellingViewComponent implements OnInit {
  
  locationId: string | null = null;

  //define speed
  //store current location

  constructor(private router: Router, private route: ActivatedRoute, public gameService: GameService, private cdr: ChangeDetectorRef, private soundService: SoundService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((qp: any) => {
      this.locationId = qp['id'];
    });
  }

  handleButtonHover() {
    this.soundService.playSound('REVERSE_ACTION_CLICK');
  }
  
  completeTrip() {
    this.router.navigate([`location`], {
      queryParams: {
        id: this.locationId
      }
    });
  }

}
