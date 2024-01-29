import { Item } from "./Item";

export class Inventory {
  items: Item[] = [];

  constructor() {
    this.items = [];
  }

  // Add an item to the inventory, if it already exists, increase the quantity
  addItem(item: Item) {
    let existingItem = this.items.find(i => i.name === item.name);
    if (existingItem) {
      existingItem.quantity! += item.quantity!;
    } else {
      this.items.push(item);
    }
  };

  // Remove an item from the inventory, if it exists, decrease the quantity, if the quantity is 0, remove the item
  removeItem(item: Item) {
    let existingItem = this.items.find(i => i.name === item.name);
    if (existingItem) {
      existingItem.quantity! -= item.quantity!;
      if (existingItem.quantity! <= 0) {
        this.items = this.items.filter(i => i.name !== item.name);
      }
    }
  };

}
