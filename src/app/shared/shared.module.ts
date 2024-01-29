import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory/inventory.component';
import { EventlogComponent } from './eventlog/eventlog.component';
import { StatsComponent } from './stats/stats.component';
import { GameService } from './game.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HealthComponent } from './health/health.component';



@NgModule({
  declarations: [
    InventoryComponent,
    EventlogComponent,
    StatsComponent,
    HealthComponent
  ],
  providers: [
    GameService,
  ],
  exports: [
    InventoryComponent,
    EventlogComponent,
    StatsComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class SharedModule { }
