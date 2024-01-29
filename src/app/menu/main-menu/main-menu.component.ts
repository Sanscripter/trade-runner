import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../shared/game.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {

  MENU_OPTIONS: Record<string,any> = {
    'start': () => this.handleStart(),
  };

  constructor(private router: Router){}

  handleMenuOption(option: string) {
    this.MENU_OPTIONS[option]();
  }

  handleStart() {
    this.router.navigate(['start']);
  };

}
