import { Component } from '@angular/core';
import { GameService } from '../../shared/game.service';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SoundService } from '../../shared/sound.service';
import { SharedModule } from '../../shared/shared.module';

//TODO: extract from here
const LIST_OF_SCENARIOS = [
  {
    id: 0,
    title: 'Pay debt',
    description: "You've been struck by tragedy and now have limited time to pay off your debt.",
    disabled: false
  },
  {
    id: 1,
    title: 'Survive',
    description: "You need to survive for a few days",
    disabled: true
  },
  {
    id: 2,
    title: 'Acquire item',
    description: "You need to acquire a specific item",
    disabled: true
  },
];

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  currentSlide: number = 0;
  public nameForm!: FormGroup;
  public triggerWarningConsent = false;
  public scenarioSelected = false;

  get scenarios() {
    return LIST_OF_SCENARIOS;
  }

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

  handleScenarioSelect(scenario: any) {
    this.scenarioSelected = true;
    this.soundService.playSound('GENERIC_ACTION_CLICK');
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

 

}
