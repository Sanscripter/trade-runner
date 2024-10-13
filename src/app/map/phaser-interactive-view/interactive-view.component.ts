import { AfterViewInit, Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import Phaser from 'phaser';
import ILocation from '../../game/ILocation.interface';
import { Player } from '../../game/Player';
import { MapScene } from './game-scenes/MapScene';


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

  phaserGame?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  @Input() cities: ILocation[] = [];

  @Input() player?: Player;


  @Output() enterLocation = new EventEmitter<ILocation>();

  @Output() fastTravelTo = new EventEmitter<ILocation>();

  @Output() mouseOverCity = new EventEmitter<ILocation | null>();

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

  // ngAfterViewInit(): void {
  //   // Pass input data to the scene before the game starts
  //   const mapScene = new MapScene();
  //   mapScene.cities = this.cities;
  //   mapScene.player = this.player;
  //   mapScene.enterLocation = this.enterLocation;
  //   mapScene.fastTravelTo = this.fastTravelTo;
  //   mapScene.mouseOverCity = this.mouseOverCity;

  //   // Update the config to include the instance
  //   this.config.scene = mapScene;

  //   // Create the Phaser game
  //   this.phaserGame = new Phaser.Game(this.config);
  // }

  ngOnDestroy() {
    if (this.phaserGame) {
      this.phaserGame.destroy(true);
    }
  }
}
