import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrl: './health.component.scss'
})
export class HealthComponent {

  @Input() health!: number;

  get healthArray() {
    return new Array(this.health);
  }
}
