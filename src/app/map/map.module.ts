import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { SharedModule } from '../shared/shared.module';
import { InteractiveViewComponent } from './interactive-view/interactive-view.component';
import { LocationComponent } from './location/location.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
  ],
  declarations: [
    MapComponent,
    LocationComponent,
    InteractiveViewComponent,
  ]
})
export class MapModule { }
