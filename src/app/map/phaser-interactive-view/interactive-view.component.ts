import { AfterViewInit, Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import Phaser from 'phaser';
import ICity from '../../utils/ICity.interface';
import { Player } from '../../game/Player';
import { MapScene } from './game-scenes/MapScene';

@Component({
  selector: 'phaser-interactive-view',
  templateUrl: './interactive-view.component.html',
  styleUrls: ['./interactive-view.component.scss']
})
export class PhaserInteractiveViewComponent implements AfterViewInit, OnDestroy {

  phaserGame?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  @Input() cities: ICity[] = [];
  @Input() player?: Player;
  
  @Output() travelledTo = new EventEmitter<ICity>();
  @Output() mouseOverCity = new EventEmitter<ICity | null>();

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [MapScene],  // Reference the scene class here
      parent: 'mapInteractiveContainer',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };
  }

  ngAfterViewInit(): void {
    // Pass input data to the scene before the game starts
    const mapScene = new MapScene();
    mapScene.cities = this.cities;
    mapScene.player = this.player;
    mapScene.travelledTo = this.travelledTo;
    mapScene.mouseOverCity = this.mouseOverCity;

    // Update the config to include the instance
    this.config.scene = mapScene;

    // Create the Phaser game
    this.phaserGame = new Phaser.Game(this.config);
  }

  ngOnDestroy() {
    if (this.phaserGame) {
      this.phaserGame.destroy(true);
    }
  }
}
