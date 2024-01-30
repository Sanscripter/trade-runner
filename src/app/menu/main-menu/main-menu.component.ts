import { Component } from '@angular/core';
import { Router } from '@angular/router';
import packageJson from '../../../../package.json';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {

  MENU_OPTIONS: Record<string,any> = {
    'start': () => this.handleStart(),
  };

  version = packageJson.version;

  constructor(private router: Router){}

  handleMenuOption(option: string) {
    this.MENU_OPTIONS[option]();
  }

  handleStart() {
    this.router.navigate(['start']);
  };

}
