import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory/inventory.component';
import { EventlogComponent } from './eventlog/eventlog.component';
import { StatsComponent } from './stats/stats.component';
import { GameService } from './game.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HealthComponent } from './health/health.component';
import { ItemAmountInputComponent } from './item-amount-input/item-amount-input.component';
import { MusicService } from './music.service';
import { MusicButtonComponent } from './music-button/music-button.component';



@NgModule({
  declarations: [
    InventoryComponent,
    EventlogComponent,
    StatsComponent,
    HealthComponent,
    ItemAmountInputComponent,
    MusicButtonComponent
  ],
  providers: [
    GameService,
    MusicService
  ],
  exports: [
    InventoryComponent,
    EventlogComponent,
    StatsComponent,
    ItemAmountInputComponent,
    MusicButtonComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class SharedModule { }
