import { ITEM_STATUS } from '../enum/item-status';
import { Item } from './Item';

export class InventoryItem {
  private itemData: Item | null = null;
  stack = 1;
  originalValue: number = 0;
  cost: number = 0;
  status: ITEM_STATUS = ITEM_STATUS.PRISTINE;

  constructor(
    item: Item,
    stack: number,
    originalValue: number,
    cost: number,
    status = ITEM_STATUS.PRISTINE
  ) {
    this.itemData = item;
    this.stack = stack;
    this.originalValue = originalValue;
    this.cost = cost;
    this.status = status;
  }

  get item() {
    return this.itemData;
  }
}
