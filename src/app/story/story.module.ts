import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { EndScreenComponent } from './end-screen/end-screen.component';
import { CreditsComponent } from './credits/credits.component';


@NgModule({
  imports: [
    SharedModule,
    CommonModule,
  ],
  declarations: [
    EndScreenComponent,
    CreditsComponent
  ],
})
export class StoryModule { }
