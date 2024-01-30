import { Component, Input } from '@angular/core';
import { Player } from '../../game/Player';
import ICity from '../../utils/ICity.interface';

@Component({
  selector: 'app-agent-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {

  @Input() stats!: Player | ICity;
  @Input() day: number = 0;

  get isPlayer() {
    return this.stats instanceof Player;
  }

}
