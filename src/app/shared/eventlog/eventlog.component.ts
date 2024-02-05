import { Component, Input, input } from '@angular/core';
import { GameEvents } from '../../game/GameEvents';

@Component({
  selector: 'app-eventlog',
  templateUrl: './eventlog.component.html',
  styleUrl: './eventlog.component.scss'
})
export class EventlogComponent {

  @Input() eventLog: GameEvents[] = [];
  @Input() day: number = 1;

  getHeat(event: GameEvents): any {
    const age = this.day - event.day;
    if (age === 0) {
      return { 'is-error': true };
    }
    if (age < 2) {
      return { 'is-warning': true };
    }
    return { 'is-primary': true };
  }
}
