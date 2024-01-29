import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    StartScreenComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class StoryModule { }
