import { GameEvent } from "./GameEvents";

export interface EventManagerConfig { 
    periodicEventLimit: number;
    eventPool: any;
    simulteneousActiveEvents: number;
}


export class GameEventsManager {
    
    periodicEventLimit: number = 5;
    similteneousActiveEvents: number = 5;
    activeEvents: GameEvent[] = [];
    _eventLog: GameEvent[] = [];


    constructor(eventConfigs?: EventManagerConfig) {
        if(eventConfigs) {
            this.periodicEventLimit = eventConfigs.periodicEventLimit;
            this.similteneousActiveEvents = eventConfigs.simulteneousActiveEvents;
        }
    }

  

}