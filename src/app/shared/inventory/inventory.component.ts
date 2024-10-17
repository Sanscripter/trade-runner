import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  DoCheck,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Inventory } from '../../game/Inventory';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Item } from '../../game/Item';
import { SoundService } from '../sound.service';
import { InventoryItem } from '../../game/InventoryItem';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent {
  @Input() inventory?: Inventory;
  @Input() mode: 'agent' | 'overworld' = 'overworld'; //ignore this
  @Input() isPlayer = false;
  @Output() change = new EventEmitter<Inventory>();

  inventoryForm: FormGroup | undefined;

  constructor(private fb: FormBuilder, private soundService: SoundService) {}

  ngOnInit() {
    this.inventoryForm = this.fb.group({
      items: this.fb.array([]),
    });
    this.inventory?.items.forEach((item) => {
      (this.inventoryForm!.controls['items'] as FormArray)!.push(
        this.fb.group({
          ...item,
          quantity: this.fb.control(item.stack),
          currentMax: item.stack,
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
    const inventoryItem = this.inventory?.items[index];
    const selected = inventoryItem?.item;
    const changedAmount = this.inventory?.items[index].stack! - currentAmount;
    const changed = new Item(
      selected!.name,
      inventoryItem!.cost!,
      selected!.description,
      selected?.id,
      selected?.image,
      selected?.slotSize,
      selected?.effects
    );
    const item = new InventoryItem(
      changed,
      changedAmount,
      inventoryItem!.cost!,
      inventoryItem!.cost!
    );
    this.emitChange(item);
    this.soundService.playSound('GENERIC_ACTION_CLICK', { playbackRate: 2 });
  }

  emitChange(item: any) {
    this.change.emit(item);
  }
}
