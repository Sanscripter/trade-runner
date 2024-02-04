import { Component } from '@angular/core';
import { GameService } from '../../shared/game.service';
import { ENDINGS } from '../../game/Endings.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrl: './end-screen.component.scss'
})
export class EndScreenComponent {

  constructor(private router: Router, public gameService: GameService) { }

  endings = ENDINGS;

  ending: number = ENDINGS.INSOLVENT;

  onInit() {
    this.ending = this.gameService.ending;
  }

  get player() {
    return this.gameService.player;
  }

  handleExit() {
    this.gameService.resetGame();
    this.router.navigate(['menu']);
  }

}
