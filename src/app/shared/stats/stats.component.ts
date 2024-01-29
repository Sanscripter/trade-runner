import { Component, Input } from '@angular/core';
import { Player } from '../../game/Player';

@Component({
  selector: 'app-player-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {

  @Input() player!: Player;
  @Input() day: number = 0;

}
