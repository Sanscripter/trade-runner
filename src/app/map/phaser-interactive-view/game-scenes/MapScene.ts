import Phaser from 'phaser';
import { EventEmitter } from '@angular/core';
import { Player } from '../../../game/Player';
import ICity from '../../../utils/ICity.interface';

export class MapScene extends Phaser.Scene {

  cities: ICity[] = [];
  player?: Player;
  travelledTo = new EventEmitter<ICity>();
  mouseOverCity = new EventEmitter<ICity | null>();

  constructor() {
    super({ key: 'MapScene' });
  }

  preload(): void {
    // Preload assets if needed
  }

  create(): void {
    // Draw the map boundary
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.strokeRect(0, 0, 2400, 1200); // Assuming these are the map dimensions

    // Render cities
    this.cities.forEach((city) => {
      const cityGraphic = this.add.rectangle(city.x, city.y, city.size * 20, city.size * 20, 0x000000)
        .setStrokeStyle(2, this.playerInCity(city) ? 0xff0000 : 0xffffff)
        .setInteractive({ useHandCursor: true });

      const cityName = this.add.text(city.x, city.y + (city.size * 20) + 10, city.name, {
        fontFamily: 'Press Start 2P',
        fontSize: '12px',
        color: this.playerInCity(city) ? '#ff0000' : '#ffffff',
        align: 'center',
      }).setOrigin(0.5);

      cityGraphic.on('pointerover', () => {
        this.mouseOverCity.emit(city);
        cityGraphic.setStrokeStyle(2, 0xff0000);
        cityName.setColor('#ff0000');
      });

      cityGraphic.on('pointerout', () => {
        this.mouseOverCity.emit(null);
        cityGraphic.setStrokeStyle(2, this.playerInCity(city) ? 0xff0000 : 0xffffff);
        cityName.setColor(this.playerInCity(city) ? '#ff0000' : '#ffffff');
      });

      cityGraphic.on('pointerdown', () => {
        this.travelledTo.emit(city);
      });
    });

    // Pan to player’s initial position
    if (this.player) {
      this.cameras.main.centerOn(this.player.position.x, this.player.position.y);
    }

    // Enable panning
    this.input.on('pointerdown', (pointer: any) => {
      this.scene.get('MapScene').input.mouse!.requestPointerLock();
      this.scene.get('MapScene').input.mouse!.disableContextMenu();
    });

    this.input.on('pointermove', (pointer: { movementX: number; movementY: number; }) => {
      if (this.input.mouse!.locked) {
        this.cameras.main.scrollX -= pointer.movementX;
        this.cameras.main.scrollY -= pointer.movementY;
      }
    });

    this.input.on('pointerup', () => {
      this.input.mouse!.releasePointerLock();
    });
  }

  override update(): void {
    // Game loop updates, if needed
  }

  playerInCity(city: ICity): boolean {
    return !!this.player && this.player.position.x === city.x && this.player.position.y === city.y;
  }
}
