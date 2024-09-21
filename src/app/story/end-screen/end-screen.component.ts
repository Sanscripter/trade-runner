import { Component, OnInit } from '@angular/core';
import { GameService } from '../../shared/game.service';
import { ENDINGS } from '../../game/Endings.enum';
import { Router } from '@angular/router';
import { SoundService } from '../../shared/sound.service';

@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrl: './end-screen.component.scss'
})
export class EndScreenComponent implements OnInit {

  constructor(private router: Router, public gameService: GameService, private soundService: SoundService) { }

  endings = ENDINGS;

  ending: number = ENDINGS.INSOLVENT;

  ngOnInit() {
    this.gameService.loadGame();
    this.ending = this.gameService.ending;
    this.playEndingSound();
  }

  get player() {
    return this.gameService.player;
  }

  handleExit() {
    this.gameService.resetGame();
    this.router.navigate(['menu']);
  }

  playEndingSound() {
    if(this.ending === ENDINGS.DIED) {
      this.soundService.playSound('AGONIZING_DEATH');
    }
  }

}
