import { Component } from '@angular/core';
import { GameService } from '../../shared/game.service';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SoundService } from '../../shared/sound.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterModule, CommonModule, SharedModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  currentSlide: number = 0;
  public nameForm!: FormGroup;
  public triggerWarningConsent = false;

  get disableNext() {
    return this.currentSlide === 6;
  }

  get disableBack() {
    return this.currentSlide === 0;
  }

  constructor(private gameService: GameService, private fb: FormBuilder, private router: Router, private soundService: SoundService) {
    this.nameForm = this.fb.group({
      playerName: ['', Validators.required]
    })
    this.nameForm.valueChanges.subscribe(() => {
      this.soundService.playSound('GENERIC_ACTION_CLICK', { playbackRate: 2 });
    });
  }

  handleNext() {
    this.currentSlide++;
    this.soundService.playSound('GENERIC_ACTION_CLICK');
  }

  handlePrevious() {
    this.currentSlide--;
    this.soundService.playSound('REVERSE_ACTION_CLICK');
  }

  handleButtonHover() {
    this.soundService.playSound('REVERSE_ACTION_CLICK');
  }

  handleGameStart() {
    const playerName = this.nameForm.get('playerName')?.value;
    this.gameService.startGame(playerName!);
    this.soundService.playSound('GENERIC_ACTION_CLICK');
    this.router.navigate(['map']);
  }

  handleWarningConsent() {
    this.triggerWarningConsent = true;
    this.soundService.playSound('GENERIC_ACTION_CLICK', { playbackRate: 0.8 });
  }

  handleWarningDenial() {
    this.soundService.playSound('REVERSE_ACTION_CLICK', { playbackRate: 0.8 });
    window.location.href = 'https://wholesomegames.com/';
  }

}
