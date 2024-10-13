import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MapModule } from './map/map.module';
import { SharedModule } from './shared/shared.module';
import { StoryModule } from './story/story.module';
import { SoundService } from './shared/sound.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Trade Runner';
}
