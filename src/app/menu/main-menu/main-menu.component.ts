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

  acceptedTriggerWarning = false;

  constructor(private router: Router, private soundService: SoundService){}

  ngOnInit() {
    setTimeout(() => {
      this.soundService.playSound('LOCATION_HOVER');
    }, 200);
  }

  handleMenuOption(option: string) {
    this.MENU_OPTIONS[option]();
    this.soundService.playSound('GENERIC_ACTION_CLICK');
  }

  handleStart() {
    this.router.navigate(['start']);
  };

  handleButtonHover() {
    this.soundService.playSound('REVERSE_ACTION_CLICK');
  }

  handleWarningConsent() {
    this.acceptedTriggerWarning = true;
    this.soundService.playSound('GENERIC_ACTION_CLICK', { playbackRate: 0.8 });
  }

  handleWarningDenial() {
    this.soundService.playSound('REVERSE_ACTION_CLICK', { playbackRate: 0.8 });
    window.location.href = 'https://wholesomegames.com/';
  }

}
