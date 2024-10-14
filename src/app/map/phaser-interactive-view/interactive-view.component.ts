import { AfterViewInit, Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import Phaser from 'phaser';
import ILocation from '../../game/ILocation.interface';
import { Player } from '../../game/Player';
import { MapScene } from './game-scenes/MapScene';
import { Game } from '../../game/Game';


const SIDEBAR_WIDTH = 0.16666667;
const TILE_SIZE = 20;
const MAP_WIDTH = 2400;
const MAP_HEIGHT = 1200;

@Component({
  selector: 'phaser-interactive-view',
  templateUrl: './interactive-view.component.html',
  styleUrls: ['./interactive-view.component.scss']
})
export class PhaserInteractiveViewComponent implements OnDestroy {

  phaserInteractiveInstance?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  
  @Input() game?: Game;

  @Output() enterLocation = new EventEmitter<ILocation>();

  @Output() fastTravelTo = new EventEmitter<ILocation>();

  @Output() mouseOverLocation = new EventEmitter<ILocation | null>();

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: MAP_WIDTH,
      height: MAP_HEIGHT,
      scene: [MapScene],  // Reference the scene class here
      parent: 'mapInteractiveContainer',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };
  }

  ngAfterViewInit(): void {
    // Pass input data to the scene before the game starts
    const mapScene = new MapScene(this.game!);
    mapScene.enterLocation = this.enterLocation;
    mapScene.fastTravelTo = this.fastTravelTo;
    mapScene.mouseOverLocation = this.mouseOverLocation;

    // Update the config to include the instance
    this.config.scene = mapScene;

    // Create the Phaser game
    this.phaserInteractiveInstance = new Phaser.Game(this.config);
  }

  ngOnDestroy() {
    if (this.phaserInteractiveInstance) {
      this.phaserInteractiveInstance.destroy(true);
    }
  }
}
