import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Inventory } from '../../game/Inventory';
import { Item } from '../../game/Item';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {

  @Input() inventory?: Inventory | undefined;
  @Input() mode: 'agent' | 'overworld' = 'overworld';
  @Output() addedItem = new EventEmitter();
  @Output() removedItem = new EventEmitter();

  inventoryForm = this.fb.group({
    items: this.fb.array([])
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.inventory?.items.forEach(item => {
      (this.inventoryForm.controls['items'] as FormArray).push(
        this.fb.group({
          quantity: this.fb.control(item.quantity)
        })
      );
    });
  }

  get items() {
    return this.inventoryForm.get('items') as FormArray<FormGroup>;
  }

  get displayHandlers() {
    return this.mode === 'agent';
  }

  handleAddItem(item: Item) {
    this.addedItem.emit(item);
  }

  handleRemoveItem(item: Item) {
    this.removedItem.emit(item);
  }



}
