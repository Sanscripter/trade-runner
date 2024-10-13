import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { GameEvent } from '../../game/GameEvents';

@Component({
  selector: 'app-eventlog',
  templateUrl: './eventlog.component.html',
  styleUrl: './eventlog.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class EventlogComponent {

  @Input() eventLog: GameEvent[] = [];
  @Input() day: number = 1;

  getHeat(event: GameEvent): any {
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
