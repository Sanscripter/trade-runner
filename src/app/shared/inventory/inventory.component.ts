import { Component, Input, OnInit, Output, EventEmitter, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { Inventory } from '../../game/Inventory';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Item } from '../../game/Item';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {

  @Input() inventory?: Inventory | undefined;
  @Input() mode: 'agent' | 'overworld' = 'overworld';
  @Output() change = new EventEmitter<Inventory>();

  inventoryForm: FormGroup | undefined;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.inventoryForm = this.fb.group({
      items: this.fb.array([])
    });
    this.inventory?.items.forEach(item => {
      (this.inventoryForm!.controls['items'] as FormArray)!.push(
        this.fb.group({
          ...item,
          quantity: this.fb.control(item.quantity),
          currentMax: item.quantity
        })
      );
    });

  }

  get items() {
    return this.inventoryForm!.get('items') as FormArray<FormGroup>;
  }

  get displayHandlers() {
    return this.mode === 'agent';
  }

  changedAmount(currentAmount: number, index: number) {
    const selected  = this.inventory?.items[index];
    const changedAmount = selected!.quantity! - currentAmount;
    const changed = new Item(selected!.name, selected!.cost, selected!.description, changedAmount);
    this.emitChange(changed);
  }

  emitChange(item: any) {
    this.change.emit(item);
  }

}
