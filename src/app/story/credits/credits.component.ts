import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.scss'
})
export class CreditsComponent {

  constructor(private router: Router) { }

  handleBack() {
    this.router.navigate(['menu']);
  }
}
