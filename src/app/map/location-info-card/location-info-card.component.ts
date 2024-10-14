import { AfterViewInit, ChangeDetectionStrategy, Component, Input, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import ILocation from '../../game/ILocation.interface';
import { Player } from '../../game/Player';

@Component({
  selector: 'app-location-info-card',
  templateUrl: './location-info-card.component.html',
  styleUrls: ['./location-info-card.component.scss'],
})
export class LocationInfoCardComponent implements OnChanges {

  @Input() location: ILocation | null | undefined;

  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['location'] && this.location) {
      this.location!.distance = this.getCurrentDistaceInDays();

      // this.updatePeriodTypes();
    }
  }
  
  @Input() player: Player | undefined;

  constructor() { }

  getCurrentDistaceInDays() {
    const currentPosition = this.player?.position!//current position of the player
    const speed = this.player?.currentStats.speed!;//speed of the player
    const distance = Math.sqrt(Math.pow(currentPosition.x - this.location!.x, 2) + Math.pow(currentPosition.y - this.location!.y, 2));
    return Math.ceil(distance / speed);
  }

}
