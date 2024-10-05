import { Item } from "./Item";

export class Inventory {
  items: Item[] = [];
  

  constructor() {
    this.items = [];
  }

  // Calculate total value of the inventory
  get totalValue() {
    return this.items.reduce((acc, item) => acc + (item.cost! * item.quantity!), 0);
  };

  // Add an item to the inventory, if it already exists, increase the quantity
  addItem(item: Item) {
    if (!item.quantity) {
      //TODO: REMOVE THIS GAMBI WHEN WE FIND OUT WHY THE QUANTITY IS NOT BEING SET
      item.quantity = 1;
    }
    let existingItem = this.items.find(i => i.name === item.name);
    if (existingItem) {
      existingItem.quantity! += item.quantity!;
    } else {
      item.originalValue = item.cost;
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

  //Update item in inventory
  updateItem(item: Item) {
    const existingItem = this.items.find(i => i.name === item.name);
    const qty = item.quantity;
    if (existingItem) {
      if (qty === 0) {
        this.items = this.items.filter(i => i.name !== item.name);
      } else {
        existingItem.quantity = item.quantity;
      }
    } else {
      this.items.push(item);
    }
  };

}
