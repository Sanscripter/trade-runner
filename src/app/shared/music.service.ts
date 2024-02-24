import { Injectable } from '@angular/core';
import { Howl } from 'howler';


@Injectable({
  providedIn: 'root'
})
export class MusicService {

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



}
