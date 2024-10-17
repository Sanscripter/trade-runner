import { SCENARIO } from '../enum/scenarios';
import { EFFECT_TYPES } from './Effect_Types.enum';
import { ENDINGS } from './Endings.enum';
import { GameEventsManager } from './EventManager';
import { GameEvent } from './GameEvents';
import ILocation from './ILocation.interface';
import { Inventory } from './Inventory';
import { InventoryItem } from './InventoryItem';
import { Item } from './Item';
import { Player } from './Player';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

//TODO: EXTRACT
const PRICE_IMPACT = {
  [EFFECT_TYPES.SCARCITY]: 1.3,
  [EFFECT_TYPES.EXCESS]: 0.4,
  [EFFECT_TYPES.POVERTY]: 0.25,
  [EFFECT_TYPES.ABUNDANCE]: 2,
  [EFFECT_TYPES.CITY_BUYING_X]: 1.5,
  [EFFECT_TYPES.CITY_SELLING_X]: 0.3,
  default: 0.8,
};

// TODO: EXTRACT
// TODO: CHANGE SOURCE
const DEFAULT_ITEMS: Record<SCENARIO, InventoryItem[]> = {
  [SCENARIO.DEBT]: [
    new InventoryItem(
      new Item(
        'Car',
        100000,
        'A useful vehicle for transportation',
        1,
        'car-ic.png',
        100,
        [
          {
            id: '1',
            name: 'transport',
            level: 1,
            description:
              'Visit 2 cities per day. Incurs variable fuel and maintenance costs.',
            source: null,
          },
          {
            id: '2',
            name: 'expansion',
            level: 3,
            description: 'Increased inventory by 15 slots.',
            source: null,
          },
        ]
      ),
      1,
      100000,
      100000
    ),
    new InventoryItem(
      new Item(
        'Bread',
        10,
        'The quintessential baked good.',
        7,
        'bread.png',
        1,
        [
          {
            id: '1',
            name: 'heal',
            level: 1,
            description: 'Replenishes some health.',
            source: null,
          },
          {
            id: '2',
            name: 'feed',
            level: 1,
            description: 'Replenishes hunger.',
            source: null,
          },
        ]
      ),
      10,
      10,
      10
    ),
    new InventoryItem(
      new Item('Knife', 1000, 'A small blade for survival.', 4, 'tool.png', 1, [
        {
          id: '1',
          name: 'cutting',
          level: 1,
          description:
            'Gives the option to cut under certain circumstances for small damage.',
          source: null,
        },
        {
          id: '2',
          name: 'intimidation',
          level: 1,
          description:
            'Gives the option to intimidate under certain circumstances. Increases the chance of stealing from traders. Decreases the chance of being jumped.',
          source: null,
        },
      ]),
      1,
      1000,
      1000
    ),
  ],
  [SCENARIO.DOOMSDAY]: [],
};

@JsonObject()
export class Game {
  @JsonProperty()
  player: Player;
  @JsonProperty()
  date = {
    day: 1,
    hour: 0,
    minute: 0,
  };

  @JsonProperty()
  eventManager: GameEventsManager;

  @JsonProperty()
  map: any;

  @JsonProperty()
  locations: ILocation[] = [];

  @JsonProperty()
  scenario: SCENARIO = SCENARIO.DEBT;

  @JsonProperty()
  configs: {
    PlayerConfig?: any;
    LocationsConfig?: any;
    ItemsConfig?: any;
    GameEventsConfig?: any;
  } = {};

  daysLimit = 30;

  constructor(config?: any) {
    this.configs = {
      ...config,
    };
    this.player = new Player(this.configs.PlayerConfig);
    DEFAULT_ITEMS[this.scenario].forEach((item) =>
      this.player.inventory.addInvItem(item)
    );
    this.eventManager = new GameEventsManager();
    this.setupLocations();
  }

  //TODO: break up into setup locations and setup NPCs (traders)
  setupLocations() {
    this.locations = this.configs.LocationsConfig?.locations.map(
      (location: ILocation) => {
        const newLocation = {
          ...location,
          inventory: new Inventory(),
        };
        location.inventory?.items?.forEach((itemRef: any) => {
          const item = this.configs.ItemsConfig?.items.find(
            (i: any) => i.id === itemRef.id
          )!;

          const newItem = new Item(
            item.name,
            item.value,
            item.description,
            item.id,
            item.image,
            item.slotSize,
            item.effects
          );

          const invItem = new InventoryItem(
            newItem,
            itemRef.quantity,
            item.value,
            item.value
          );
          newLocation.inventory.addInvItem(invItem);
        });
        return newLocation;
      }
    );
  }

  computeLocationChanges() {
    this.locations.forEach((c) => {
      if (c.mobile) {
        const speed = c.speed ?? 1; // Default speed to 1 if it's undefined
        const deltaX = Math.floor(((Math.random() > 0.3 ? 1 : -1) * speed) / 2);
        const deltaY = Math.floor(((Math.random() > 0.3 ? 1 : -1) * speed) / 2);

        c.x += deltaX;
        c.y += deltaY;
      }
    });
  }

  updateLocationPrices(location: ILocation, relevantEvents: GameEvent[]) {
    location.inventory?.items.forEach((item) => {
      const effect = relevantEvents.find(
        (e) =>
          e.effect.subject === item && e.effect.subject.id === item.item!.id
      )?.effect;
      const priceImpact =
        effect?.type === EFFECT_TYPES.SCARCITY
          ? 1.3
          : effect?.type === EFFECT_TYPES.EXCESS
          ? 0.4
          : 0.8;
      item.cost = item.item!.value * (priceImpact + Math.random() + 0.01);
    });
  }

  upstatePlayerPrices(relevantEvents: GameEvent[]) {
    this.player.inventory.items.forEach((item) => {
      const effect = relevantEvents.find(
        (e) =>
          e.effect.subject === item && e.effect.subject.id === item.item!.id
      )?.effect;
      const priceImpact =
        effect?.type === EFFECT_TYPES.SCARCITY
          ? 1.3
          : effect?.type === EFFECT_TYPES.EXCESS
          ? 0.4
          : 0.8;
      const finalPrice =
        item.item!.value * (priceImpact + Math.random() + 0.01);
      item.cost = finalPrice;
    });
  }

  getDaysTravelled(position: { x: number; y: number }) {
    const distance = Math.sqrt(
      Math.pow(this.player.position.x - position.x, 2) +
        Math.pow(this.player.position.y - position.y, 2)
    );
    return Math.ceil(distance / this.player.currentStats.speed.value);
  }

  get eventLog() {
    return this.eventManager._eventLog.reverse();
  }

  get ending() {
    if (this.player.currentStats.health.value <= 0) {
      return ENDINGS.DIED;
    }
    if (this.player.money >= 1000000) {
      return ENDINGS.RICH;
    }
    if (this.player.money >= 50000) {
      return ENDINGS.PAID;
    }
    return ENDINGS.INSOLVENT;
  }

  getCurrentDay() {
    return this.date.day;
  }

  produceMoreItems() {
    this.locations.forEach((city) => {
      const amountOfNewItems = Math.floor(Math.random() * 10);
      for (let i = 0; i < amountOfNewItems; i++) {
        const item =
          this.configs.ItemsConfig.items[
            Math.floor(Math.random() * this.configs.ItemsConfig.items.length)
          ];
        const value = Math.ceil(Math.random() * 10);
        const newItem = new Item(
          item.name,
          item.value,
          item.description,
          item.id,
          item.image,
          item.slotSize,
          item.effects
        );
        const invItem = new InventoryItem(
          newItem,
          value,
          item.value,
          item.value
        );
        city.inventory?.addInvItem(invItem);
      }
    });
  }

  advanceDay(daysTravelled: number) {
    this.date.day += daysTravelled ?? 1;
    console.log('Day', this.date.day);
    try {
      this.produceMoreItems();
      this.generateEvents();
    } catch (e) {
      console.error('Error generating events', e);
    }
  }

  generateEvents() {
    const todayEventCount = Math.floor(
      Math.random() * this.eventManager.periodicEventLimit + 1
    );
    if (this.eventManager.activeEvents.length > 0 && this.date.day % 2 === 0) {
      this.eventManager.activeEvents.splice(
        this.eventManager.activeEvents.length - 1,
        1
      );
    }
    for (let i = 0; i < todayEventCount; i++) {
      let eventConfig =
        this.configs.GameEventsConfig?.events[
          Math.floor(
            Math.random() * this.configs.GameEventsConfig.events.length
          )
        ];
      let event = new GameEvent(eventConfig, this.date.day);
      this.proccessEventEffect(event);
      this.eventManager._eventLog.push(event);
    }
  }

  proccessEventEffect(event: GameEvent) {
    let subject: ILocation | Item | Player | undefined;
    let target: ILocation | Item | any | undefined;
    let effect = event.effect;
    if (
      effect.type === EFFECT_TYPES.POVERTY ||
      effect.type === EFFECT_TYPES.ABUNDANCE
    ) {
      subject =
        this.locations[Math.floor(Math.random() * this.locations.length)];
      this.eventManager.activeEvents = this.eventManager.activeEvents.filter(
        (e) =>
          !(
            e.effect.subject?.name === subject?.name &&
            (e.effect.type === EFFECT_TYPES.POVERTY
              ? e.effect.type === EFFECT_TYPES.ABUNDANCE
              : e.effect.type === EFFECT_TYPES.POVERTY)
          )
      );
    } else if (
      effect.type === EFFECT_TYPES.SCARCITY ||
      effect.type === EFFECT_TYPES.EXCESS
    ) {
      const index = Math.floor(
        Math.random() * this.configs.ItemsConfig.items.length
      );
      subject = this.configs.ItemsConfig.items[index];

      this.eventManager.activeEvents = this.eventManager.activeEvents.filter(
        (e) =>
          !(
            e.effect.subject?.name === subject?.name &&
            (e.effect.type === EFFECT_TYPES.SCARCITY
              ? e.effect.type === EFFECT_TYPES.EXCESS
              : e.effect.type === EFFECT_TYPES.SCARCITY)
          )
      );
    } else if (
      effect.type === EFFECT_TYPES.CITY_BUYING_X ||
      effect.type === EFFECT_TYPES.CITY_SELLING_X
    ) {
      subject =
        this.locations[Math.floor(Math.random() * this.locations.length)];
      target =
        this.configs.ItemsConfig.items[
          Math.floor(Math.random() * this.configs.ItemsConfig.items.length)
        ];
      const qty = Math.ceil(
        (effect.type === EFFECT_TYPES.CITY_BUYING_X ? 1 : 20) * Math.random() +
          2
      );
      const seedItem = new Item(
        target!.name,
        target!.value,
        target?.description,
        target!.id,
        target!.image,
        target!.slotSize,
        target!.effects
      );
      const inventoryItem = new InventoryItem(
        seedItem,
        qty,
        target!.value,
        target!.value
      );
      subject.inventory?.addInvItem(inventoryItem);
      this.eventManager.activeEvents = this.eventManager.activeEvents.filter(
        (e) =>
          !(
            e.effect.subject?.name === subject?.name &&
            (e.effect.type === EFFECT_TYPES.CITY_BUYING_X
              ? e.effect.type === EFFECT_TYPES.CITY_SELLING_X
              : e.effect.type === EFFECT_TYPES.CITY_BUYING_X)
          )
      );
    }
    effect = {
      ...effect,
      subject: subject,
      target: target,
    };
    if (!effect.subject) {
      console.log('THIS IS THE MISSING SUBJECT', subject);
      console.log('effect', effect);
      console.log('target', target);
    }
    event.setEffect(effect);
    this.eventManager.activeEvents.push(event);
  }

  isGameOver() {
    return (
      this.player.currentStats.health.value <= 0 ||
      this.date.day >= this.daysLimit
    );
  }

  getCurrentLocalEconomy(location: ILocation) {
    const relevantEvents = this.eventManager.activeEvents.filter((event) => {
      let effect = event.effect;
      return (
        effect.subject === location ||
        [EFFECT_TYPES.SCARCITY, EFFECT_TYPES.EXCESS].includes(effect.type)
      );
    });
    this.updateLocationPrices(location, relevantEvents);
    this.upstatePlayerPrices(relevantEvents);
    this.reflectEconomicStatus(location, relevantEvents);
    return location;
  }

  reflectEconomicStatus(location: ILocation, relevantEvents: GameEvent[]) {
    if (
      relevantEvents.find((e) => e.effect.type === EFFECT_TYPES.CITY_BUYING_X)
    ) {
      let playerItem = this.player.inventory.items.find(
        (item) =>
          item.item?.id ===
          relevantEvents.find(
            (e) => e.effect.type === EFFECT_TYPES.CITY_BUYING_X
          )?.effect.target?.id
      );
      playerItem!.cost = playerItem?.cost! * (1.5 + Math.random()) + 0.01;
      let locationItem = location.inventory?.items.find(
        (item) =>
          item.item?.id ===
          relevantEvents.find(
            (e) => e.effect.type === EFFECT_TYPES.CITY_BUYING_X
          )?.effect.target?.id
      );
      locationItem!.cost = locationItem?.cost! * (1.9 + Math.random()) + 0.01;
    }
    if (
      relevantEvents.find((e) => e.effect.type === EFFECT_TYPES.CITY_SELLING_X)
    ) {
      let event = relevantEvents.find(
        (e) => e.effect.type === EFFECT_TYPES.CITY_SELLING_X
      )!;
      let relevantItem = this.configs.ItemsConfig.items.find(
        (item: Item) => item.id === event.effect.target?.id
      );
      let playerItem = this.player.inventory.items.find(
        (item) => item.item?.id === relevantItem?.id
      );
      playerItem!.cost = playerItem?.cost! * (0.3 + Math.random()) + 0.01;
      let locationItem = location.inventory?.items.find(
        (item) => item.item?.id === relevantItem?.id
      );
      let cost = relevantItem?.value! * (0.5 + Math.random()) + 0.01;
      let qty = Math.ceil(5 * Math.random() + 2);
      if (!locationItem) {
        let excessItem = new Item(
          relevantItem?.name!,
          cost,
          relevantItem?.description!,
          relevantItem?.id!,
          relevantItem?.image!,
          qty,
          relevantItem?.effects!
        );
        const excessInvItem = new InventoryItem(
          excessItem,
          relevantItem?.slotSize!,
          cost,
          cost
        );
        location.inventory?.addInvItem(excessInvItem);
      }
      locationItem!.cost = cost;
      locationItem!.stack = locationItem!.stack! + qty;
    }
    if (relevantEvents.find((e) => e.effect.type === EFFECT_TYPES.POVERTY)) {
      location.inventory?.items.forEach((item) => {
        item.cost = item.item!.value * (0.25 + Math.random());
      });
      this.player.inventory.items.forEach((item) => {
        item.cost = item.item!.value * (1.25 + Math.random());
      });
      location.money = location.size * 500 * (0.5 + Math.random());
    }
    if (relevantEvents.find((e) => e.effect.type === EFFECT_TYPES.ABUNDANCE)) {
      location.inventory?.items.forEach((item) => {
        item.cost = item.item!.value * (2 + Math.random());
      });
      this.player.inventory.items.forEach((item) => {
        item.cost = item.item!.value * (0.5 + Math.random());
      });
      location.money = location.size * 2000 * (2 + Math.random());
    }

    location.money =
      location.money! + location.money! * 0.3 * (0.5 - Math.random());
  }
}
