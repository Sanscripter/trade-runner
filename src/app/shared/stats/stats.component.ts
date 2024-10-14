import { Component, Input } from '@angular/core';
import { Player } from '../../game/Player';
import ILocation from '../../game/ILocation.interface';

@Component({
  selector: 'app-agent-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {

  @Input() stats!: Player | ILocation;
  @Input() day: number = 0;

  get isPlayer() {
    return this.stats instanceof Player;
  }

  get playerHealth(): number {
    return this.stats instanceof Player ? this.stats.currentStats.health : 0;
  }

}
