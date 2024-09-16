import { Injectable } from '@angular/core';
import { Howl } from 'howler';

export const sounds: any = {
  CONFIRM: '../assets/sounds/confirm.mp3',
  CANCEL: '../assets/sounds/cancel.mp3',
  EVIL_CUE_0: './assets/sounds/steal.mp3',
  EVIL_CUE_1: './assets/sounds/steal.mp3',
  EVIL_CUE_2: './assets/sounds/steal.mp3',
  TRADE: './assets/sounds/trade.mp3',
  GENERIC_ACTION_CLICK: './assets/sounds/generic_button_click.wav',
  REVERSE_ACTION_CLICK: './assets/sounds/reverse_button_click.mp3',
};

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  currentMusic: any;

  constructor() { }

  playMusic() {
    if (!this.currentMusic) {
      // this.currentMusic = new Howl({
      //   src: ['../assets/music/' + 'main' + '.mp3'],
      //   autoplay: true,
      //   loop: true,
      //   volume: 0.3,
      // });
    }
    // this.currentMusic.play();
  }

  pauseMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
    }
  }

  playSound(sound: string, opts?: any) {
    const audio = new Audio(sounds[sound]);
    audio.playbackRate = opts?.playbackRate || 1;
    audio.play();
  }
}
