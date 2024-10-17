export enum ITEM_STATUS {
  // FOOD
  FRESH = 'fresh', // The food is in good condition, recently made or harvested, and ideal for consumption.
  STALE = 'stale', // The food is starting to lose its freshness but is still safe to eat.
  ROTTEN = 'rotten', // The item has decayed or spoiled, typically for perishable items.

  // ITEMS IN GENERAL
  PRISTINE = 'pristine', // The item is in perfect condition, as if it were brand new.
  MINT = 'mint', // The item is in nearly perfect condition, with minimal signs of use.
  REFURBISHED = 'refurbished', // The item has been restored to a good condition, not as perfect as new.
  REPAIRED = 'repaired', // The item was broken or damaged but has been fixed to a usable state.
  WEATHERED = 'weathered', // The item has been exposed to the elements and shows signs of aging.
  DAMAGED = 'damaged', // The item is partially broken but may still have some functionality.
  BROKEN = 'broken', // The item is damaged and may not function properly.

  // FABRICS
  WORN = 'worn', // The item has significant wear but can still be used.
  STAINED = 'stained', // The item has discoloration or spots that cannot be removed.

  // SPECIAL
  ANTIQUE = 'antique', // The item is old but may have value due to its age and rarity.
  RUSTED = 'rusted', // The item has oxidized, affecting its appearance or functionality (typically for metal objects).
  DECAYING = 'decaying', // The item is deteriorating gradually, often applied to organic materials.
}
