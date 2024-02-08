import { Component } from '@angular/core';
import { Router } from '@angular/router';
import packageJson from '../../../../package.json';
import { MusicService } from '../../shared/music.service';

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

  constructor(private router: Router, private musicService: MusicService){}

  ngOnInit() {
    this.musicService.playMusic();
  }

  handleMenuOption(option: string) {
    this.MENU_OPTIONS[option]();
  }

  handleStart() {
    this.router.navigate(['start']);
  };

}
