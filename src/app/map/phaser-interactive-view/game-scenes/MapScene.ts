import Phaser from 'phaser';
import { EventEmitter } from '@angular/core';
import { Player } from '../../../game/Player';
import ILocation from '../../../game/ILocation.interface';
import { Game } from '../../../game/Game';

export class MapScene extends Phaser.Scene {


  enterLocation = new EventEmitter<ILocation>();

  fastTravelTo = new EventEmitter<ILocation>();

  mouseOverCity = new EventEmitter<ILocation | null>();
  

  baseGame!: Game;


  pointerDownTimer: any;


  constructor(game: Game) {
    super({ key: 'MapScene' });
    this.baseGame = game;
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
    this.renderCities();
    //Render player
    this.renderPlayer();
    //Capture inputs
    this.setInputListeners();
  }

  override update(): void {
    
  }


  renderPlayer(): void {
    // this.playerMarker = this.physics.add.body(this.player?.position.x, this.player?.position.y, 10, 10, 0xffffff)
  }

  renderCities(): void {
    // Render cities
    // this.baseGame.locations.forEach((city) => {
    //   let playerInCity= this.isPlayerInCity(city);
      
      
    //   const cityGraphic = this.add.rectangle(city.x, city.y, city.size * 20, city.size * 20, 0x000000)
    //     .setStrokeStyle(3, playerInCity ? 0xff0000 : 0xffffff)
    //     .setInteractive({ useHandCursor: true });

    //   const cityName = this.add.text(city.x, city.y + (city.size * 15), city.name, {
    //     fontFamily: 'Press Start 2P',
    //     fontSize: '1000px',
    //     color: playerInCity ? '#ff0000' : '#ffffff',
    //     align: 'center',
    //   }).setOrigin(0.5);

    //   cityGraphic.on('pointerover', () => {
    //     this.mouseOverCity.emit(city);
    //     cityGraphic.setStrokeStyle(2, 0xff0000);
    //     cityName.setColor('#ff0000');
    //   });

    //   cityGraphic.on('pointerout', () => {
    //     this.mouseOverCity.emit(null);
    //     cityGraphic.setStrokeStyle(2, playerInCity ? 0xff0000 : 0xffffff);
    //     cityName.setColor(playerInCity ? '#ff0000' : '#ffffff');
    //   });

    //   cityGraphic.on('pointerdown', () => {
    //     if (playerInCity) {
    //       this.enterLocation.emit(city);
    //     } else {
    //       // this.player?.setTargetPosition(city);
    //       console.log('normaltravel');
    //     }
    //   });
    // });

  }

  setInputListeners(): void{

  }

  // isPlayerInCity(city: ILocation): boolean {
  //   return !!this.player && this.player.position.x === city.x && this.player.position.y === city.y;
  // }

  // hasPlayerArrived(): boolean {
  //   if(!this.player?.targetPosition) return false;
  //   return this.player?.position.x === this.player?.targetPosition.x && this.player?.position.y === this.player?.targetPosition.y;
  // }




  // isLeftMouseButtonDown () {
  //   return this.input.mousePointer.leftButtonDown();
  // }

  // isRightMouseButtonDown () {
  //   return this.input.mousePointer.rightButtonDown();
  // }
}
