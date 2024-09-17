import { Component } from '@angular/core';
import { Router } from '@angular/router';
import packageJson from '../../../../package.json';
import { SoundService } from '../../shared/sound.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {

  MENU_OPTIONS: Record<string,any> = {
    'start': () => this.handleStart(),
    'credits': () => this.router.navigate(['credits']),
  };

  version = packageJson.version;

  constructor(private router: Router, private musicService: SoundService){}

  ngOnInit() {
    // this.musicService.playMusic();
  }

  handleMenuOption(option: string) {
    this.MENU_OPTIONS[option]();
    this.musicService.playSound('GENERIC_ACTION_CLICK');
  }

  handleStart() {
    this.router.navigate(['start']);
  };

  handleButtonHover() {
    this.musicService.playSound('REVERSE_ACTION_CLICK');
  }

}
