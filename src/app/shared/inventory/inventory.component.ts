import { Component, Input, OnInit } from '@angular/core';
import { Inventory } from '../../game/Inventory';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {

  @Input() inventory?: Inventory | undefined;
  @Input() mode: 'buy' | 'sell' | 'overworld' = 'overworld';

  ngOnInit() {
    console.log(this.inventory);
  }

}
