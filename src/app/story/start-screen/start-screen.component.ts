import { Component } from '@angular/core';
import { GameService } from '../../shared/game.service';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  currentSlide: number = 0;
  public nameForm!: FormGroup;

  constructor(private gameService: GameService, private fb: FormBuilder, private router: Router) {
    this.nameForm = this.fb.group({
      playerName: ['', Validators.required]
    })
  }

  handleNext() {
    this.currentSlide++;
  }

  handlePrevious() {
    this.currentSlide--;
  }


  handleGameStart() {
    const playerName = this.nameForm.get('playerName')?.value;
    this.gameService.startGame(playerName!);
    this.router.navigate(['map']);
  }

}
