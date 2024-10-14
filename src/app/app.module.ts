import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MapModule } from './map/map.module';
import { SharedModule } from './shared/shared.module';
import { StoryModule } from './story/story.module';
import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { GameService } from './shared/game.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule, 
    MapModule, 
    StoryModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    GameService,
  ],
  bootstrap: [AppComponent],
  declarations: [AppComponent]
})
export class AppModule { }
