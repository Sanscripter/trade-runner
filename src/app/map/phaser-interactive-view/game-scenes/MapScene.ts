import Phaser from 'phaser';
import { EventEmitter } from '@angular/core';
import { Player } from '../../../game/Player';
import ILocation from '../../../game/ILocation.interface';
import { Game } from '../../../game/Game';

export class MapScene extends Phaser.Scene {

  enterLocation = new EventEmitter<ILocation>();

  fastTravelTo = new EventEmitter<ILocation>();

  mouseOverLocation = new EventEmitter<ILocation | null>();

  baseGame!: Game;

  // Add a class property for the player graphic
  private playerGraphic!: Phaser.GameObjects.Arc;

  private pointerDownTimer: any;

  private playerTween?: Phaser.Tweens.Tween;

  private locationGraphics: { graphic: Phaser.GameObjects.Rectangle, location: ILocation }[] = [];

  private isDragging: boolean = false;
  private dragStartPoint: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
  private cameraStartPoint: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  // Keep track of entered locations to prevent multiple triggers
  private enteredLocations: Set<ILocation> = new Set();

  // Keep track of the destination location
  private destinationLocation?: ILocation;

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

    // Set camera bounds with extra 200px on each side
    this.cameras.main.setBounds(-200, -200, 2400 + 400, 1200 + 400);

    // Render player
    this.renderPlayer();

    // Capture inputs
    this.setInputListeners();

    // Render locations
    this.renderPointsOfInterest();
  }

  override update(): void {
    if (!this.baseGame.player) return;

    // Update the player's position
    this.renderPlayer();

    // Only check collision when the player is moving
    if (this.playerTween) {
    }
  }

  checkPlayerCollision(): void {
    // Check for collision between player and locations
    const playerX = this.baseGame.player.position.x;
    const playerY = this.baseGame.player.position.y;
    const playerRadius = 2; // Assuming radius of the player circle is 2

    this.locationGraphics.forEach(({ graphic, location }) => {
      const rect = graphic.getBounds();

      // Check if the player's circle is entirely within the rectangle
      if (
        playerX - playerRadius >= rect.left &&
        playerX + playerRadius <= rect.right &&
        playerY - playerRadius >= rect.top &&
        playerY + playerRadius <= rect.bottom
      ) {
        // Player is entirely within this location
        if (!this.enteredLocations.has(location)) {
          console.log(`Player has entered ${location.name}`);
          // Emit event or handle accordingly
          this.enterLocation.emit(location);
          this.enteredLocations.add(location);

          // Stop the player's movement
          if (this.playerTween) {
            this.playerTween.stop();
            this.playerTween = undefined;
          }
        }
      }
    });
  }
  renderPlayer(): void {
    if (!this.baseGame.player) return;
    if (!this.playerGraphic) {
      // Initialize the player graphic
      this.playerGraphic = this.add.circle(
        this.baseGame.player.position.x,
        this.baseGame.player.position.y,
        2,
        0xff0000
      );
      return;
    }
    // Update the position of the existing player graphic
    this.playerGraphic.setPosition(
      this.baseGame.player.position.x,
      this.baseGame.player.position.y
    );
  }

  setTravelPoint(targetLocation: ILocation | { x: number; y: number }): void {
    // Stop any existing tween
    if (this.playerTween) {
      this.playerTween.stop();
    }

    // Reset entered locations
    this.enteredLocations.clear();

    // Set the destination location
    if ('name' in targetLocation) {
      // It's an ILocation
      this.destinationLocation = targetLocation;
    } else {
      // It's a coordinate point
      this.destinationLocation = undefined;
    }

    // Calculate the distance between the player's current position and the target location
    const distance = Phaser.Math.Distance.Between(
      this.baseGame.player.position.x,
      this.baseGame.player.position.y,
      targetLocation.x,
      targetLocation.y
    );

    // Get the player's current speed (units per second)
    const speed = this.baseGame.player.currentStats.speed;

    // Calculate the duration of the tween based on distance and speed
    const duration = (distance / (speed * 20)) * 1000; // Convert seconds to milliseconds

    // Animate the player moving to the target location
    this.playerTween = this.tweens.add({
      targets: this.baseGame.player.position,
      x: targetLocation.x,
      y: targetLocation.y,
      duration: duration,
      ease: 'Linear',
      onUpdate: () => {
        this.renderPlayer();
        // Collision detection is now handled in update() method
      },
      onComplete: () => {
        this.checkPlayerCollision();
        console.log('Player has arrived at the destination.');
        this.playerTween = undefined;
        this.destinationLocation = undefined;
      },
    });
  }

  renderPointsOfInterest(): void {
    // Render locations
    this.baseGame.locations.forEach((location) => {
      const locationGraphic = this.add
        .rectangle(
          location.x,
          location.y,
          location.size * 20,
          location.size * 20,
          0x000000
        )
        .setStrokeStyle(3, 0xffffff)
        .setInteractive({ useHandCursor: true });

      // Store the graphic and location
      this.locationGraphics.push({ graphic: locationGraphic, location });

      const locationName = this.add
        .text(
          location.x,
          location.y + location.size * 15,
          location.name,
          {
            fontFamily: 'Press Start 2P',
            fontSize: '1000px',
            color: '#ffffff',
            align: 'center',
          }
        )
        .setOrigin(0.5);

      locationGraphic.on('pointerover', () => {
        this.mouseOverLocation.emit(location);
        locationGraphic.setStrokeStyle(2, 0xff0000);
        locationName.setColor('#ff0000');
      });

      locationGraphic.on('pointerout', () => {
        this.mouseOverLocation.emit(null);
        locationGraphic.setStrokeStyle(2, 0xffffff);
        locationName.setColor('#ffffff');
      });

      locationGraphic.on('pointerdown', () => {
        // Start traveling to the location
        this.setTravelPoint(location);
      });
    });
  }

  setInputListeners(): void {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.dragStartPoint.set(pointer.x, pointer.y);
      this.cameraStartPoint.set(
        this.cameras.main.scrollX,
        this.cameras.main.scrollY
      );
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;

      const distance = Phaser.Math.Distance.Between(
        this.dragStartPoint.x,
        this.dragStartPoint.y,
        pointer.x,
        pointer.y
      );

      if (distance > 10 || this.isDragging) {
        this.isDragging = true;

        const dragX = pointer.x - this.dragStartPoint.x;
        const dragY = pointer.y - this.dragStartPoint.y;

        // Adjust for zoom level to ensure consistent dragging speed
        this.cameras.main.scrollX = this.cameraStartPoint.x - dragX / this.cameras.main.zoom;
        this.cameras.main.scrollY = this.cameraStartPoint.y - dragY / this.cameras.main.zoom;
      }
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        this.isDragging = false;
      } else {
        // Treat this as a click
        this.setTravelPoint({
          x: pointer.worldX,
          y: pointer.worldY,
        });
      }
    });

    // Zoom with mouse wheel
    this.input.on('wheel', (_pointer: any, _gameObjects: any, _deltaX: any, deltaY: number, _deltaZ: any) => {
      if (deltaY > 0) {
        // Zoom out
        this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom - 0.1, 0.5, 2);
      } else if (deltaY < 0) {
        // Zoom in
        this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom + 0.1, 0.5, 2);
      }
    });

    // Zoom with '+' and '-' keys
    this.input.keyboard!.on('keydown', (event: any) => {
      if (event.key === '+' || event.key === '=') {
        // Zoom in
        this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom + 0.1, 0.5, 2);
      } else if (event.key === '-') {
        // Zoom out
        this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom - 0.1, 0.5, 2);
      }
    });
  }
}
