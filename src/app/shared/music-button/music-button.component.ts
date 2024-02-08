import { Component, OnInit } from '@angular/core';
import { MusicService } from '../music.service';

@Component({
  selector: 'app-music-button',
  templateUrl: './music-button.component.html',
  styleUrls: ['./music-button.component.css']
})
export class MusicButtonComponent {

  isMusicPlaying: boolean = true;

  constructor(private musicService: MusicService) { }

  handleMusicButton() {
    if (this.isMusicPlaying) {
      this.musicService.pauseMusic();
      this.isMusicPlaying = false;
    } else {
      this.musicService.playMusic();
      this.isMusicPlaying = true;
    }
  }
}
