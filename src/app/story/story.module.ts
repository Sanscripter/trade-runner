import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { EndScreenComponent } from './end-screen/end-screen.component';
import { CreditsComponent } from './credits/credits.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule, 
    FormsModule, 
    RouterModule
  ],
  declarations: [
    EndScreenComponent,
    CreditsComponent,
    StartScreenComponent
  ],
  exports: [
    EndScreenComponent,
    CreditsComponent,
    StartScreenComponent
  ]
})
export class StoryModule { }
