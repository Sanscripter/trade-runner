import { InventoryItem } from './InventoryItem';
import { Effect } from './Effect';

export class Inventory {
  items: InventoryItem[] = [];
  // TODO: WHILE WE DONT HAVE THE ENDURANCE STATUS BASESLOTS IS 10000 (TRADERS HAVE WAAAAAAY TOO MANY ITEMS)
  baseSlots: number = 10000;
  additionalSlots: number = 0;
  appliedEffects: Effect[] = []; // Stores all applied effects

  constructor() {
    this.items = [];
  }

  // Calculate total value of the inventory
  get totalValue() {
    return this.items.reduce(
      (acc, invItem) => acc + invItem.cost * invItem.stack,
      0
    );
  }

  get totalSlots() {
    return this.baseSlots + this.additionalSlots;
  }

  // Calculate the used slots in the inventory
  get usedSlots() {
    return this.items.reduce(
      (acc, invItem) => acc + (invItem.item?.slotSize || 1) * invItem.stack,
      0
    );
  }

  addInvItem(invItem: InventoryItem) {
    const requiredSlots = (invItem.item?.slotSize || 1) * invItem.stack;
    if (this.usedSlots + requiredSlots > this.totalSlots) {
      // TODO: UI FOR MISSING SPACE ON INVENTORY
      console.log(
        'There is not enough space in your inventory to add this item.'
      );
      return;
    }

    const existingItem = this.items.find(
      (i) => i.item?.id === invItem.item?.id
    );
    if (existingItem) {
      existingItem.stack += invItem.stack;
    } else {
      this.items.push(invItem);
    }

    this.applyEffects(invItem);
  }

  // Remove an item from the inventory, if it exists, decrease the quantity, if the quantity is 0, remove the item and its effects if applicable
  removeInvItem(invItem: InventoryItem) {
    const existingItem = this.items.find(
      (i) => i.item?.id === invItem.item?.id
    );
    if (existingItem) {
      existingItem.stack -= invItem.stack;
      if (existingItem.stack <= 0) {
        this.removeEffects(existingItem);
        this.items = this.items.filter(
          (i) => i.item?.name !== invItem.item?.name
        );
      }
    }
  }

  // Update item in inventory
  updateItem(invItem: InventoryItem) {
    const existingItem = this.items.find(
      (i) => i.item?.id === invItem.item?.id
    );
    const qty = invItem.stack;
    if (existingItem) {
      if (qty === 0) {
        this.removeEffects(existingItem);
        this.items = this.items.filter((i) => i.item?.id !== invItem.item?.id);
      } else {
        existingItem.stack = qty;
      }
    } else {
      this.items.push(invItem);
    }
  }

  // Apply effects to the inventory based on the item's effects
  applyEffects(invItem: InventoryItem) {
    const itemEffects = invItem.item?.effects || [];
    itemEffects.forEach((effect) => {
      // Check if the effect is already applied
      const existingEffect = this.appliedEffects.find(
        (e) => e.id === effect.id
      );

      if (!existingEffect) {
        this.appliedEffects.push({
          ...effect,
          source: invItem.item || null,
        });

        if (effect.name === 'expansion') {
          const additionalSlots = effect.level * 5;
          this.additionalSlots += additionalSlots;
        }
      }
    });
  }

  // Remove effects when an item is removed, and check for replacement items with the same effect level
  removeEffects(invItem: InventoryItem) {
    const itemEffects = invItem.item?.effects || [];
    itemEffects.forEach((effect) => {
      const existingEffectIndex = this.appliedEffects.findIndex(
        (e) => e.id === effect.id && e.source?.id === invItem.item?.id
      );

      if (existingEffectIndex !== -1) {
        // Remove the effect
        const [removedEffect] = this.appliedEffects.splice(
          existingEffectIndex,
          1
        );

        if (removedEffect.name === 'expansion') {
          const removedSlots = removedEffect.level * 5;
          this.additionalSlots -= removedSlots;

          // Check if there is another item with the same expansion level
          const replacementItem = this.items.find((item) =>
            item.item?.effects?.some(
              (e) => e.name === 'expansion' && e.level === removedEffect.level
            )
          );

          if (replacementItem) {
            this.applyEffects(replacementItem);
          }
        }
      }
    });
  }
}
