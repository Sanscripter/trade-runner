import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MapModule } from './map/map.module';
import { SharedModule } from './shared/shared.module';
import { StoryModule } from './story/story.module';
import { MusicService } from './shared/music.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SharedModule, MapModule, StoryModule, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Trade Runner';
}
