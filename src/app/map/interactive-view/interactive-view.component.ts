import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { fabric } from 'fabric';
import ILocation from '../../game/ILocation.interface';
import { Player } from '../../game/Player';

const SIDEBAR_WIDTH = 0.16666667;
const TILE_SIZE = 20;
const MAP_WIDTH = 2400;
const MAP_HEIGHT = 1200;

@Component({
  selector: 'app-interactive-view',
  templateUrl: './interactive-view.component.html',
  styleUrls: ['./interactive-view.component.scss'],
})
export class InteractiveViewComponent implements AfterViewInit {
  canvasCtx: CanvasRenderingContext2D | null = null;
  @ViewChild('interactiveViewCanvas')
  canvas!: HTMLCanvasElement;
  fabricCanvas!: fabric.Canvas;
  mouseUp: any;

  @Input() cities: ILocation[] = [];

  @Input() player?: Player;


  @Output() enterLocation = new EventEmitter<ILocation>();

  @Output() fastTravelTo = new EventEmitter<ILocation>();

  @Output() mouseOverCity = new EventEmitter<ILocation | null>();

  playerMarker?: fabric.Rect;

  isPanning: boolean = false;
  selection: boolean = false;
  lastPosX: number = 0;
  lastPosY: number = 0;
  visibleArea = { left: 0, top: 0, right: 0, bottom: 0 };
  viewport: any;

  ngAfterViewInit(): void {
    fabric.Object.prototype.objectCaching = true;

    this.fabricCanvas = new fabric.Canvas('interactiveViewCanvas', {
      backgroundColor: 'black',
      selection: false,
      preserveObjectStacking: true,
    });

    // First load adjust
    this.resizeCanvas();

    this.fabricCanvas.on('mouse:dblclick', (e) => {
      //don't allow dbclick on rect
      if (e.target && e.target.type === 'rect') {
        return;
      }
      this.animatePlayerMove(e)
    });
    

    // this.fabricCanvas.on('mouse:dblclick', (e) => {
    //   console.log(e.pointer, 'dblclick');
    //   return;

    //   // this.playerMarker!.top = e.pointer!.y;
    //   // this.playerMarker!.left = e.pointer!.x;
    //   this.playerMarker?.animate('top', this.transformTop(e.pointer!.y), {
    //     duration: this.travelDuration(e.pointer!.y, this.player!.position.y),
    //     easing: fabric.util.ease.easeOutCubic,
    //     onChange: () => {
    //       this.fabricCanvas.renderAll();
    //     },
    //     onComplete: () => {
    //       // this.fabricCanvas.absolutePan(this.playerMarker!.getCoords()[0]);

    //       this.player!.position = { x: e.pointer!.x, y: e.pointer!.y };
    //     }
    //   });

    //   this.playerMarker?.animate('left', this.transformLeft(e.pointer!.x), {
    //     duration: this.travelDuration(e.pointer!.x, this.player!.position.x),
    //     easing: fabric.util.ease.easeOutCubic,
    //     onChange: () => {
    //       this.fabricCanvas.renderAll();
    //     },
    //     onComplete: () => {
    //       // this.fabricCanvas.absolutePan(this.playerMarker!.getCoords()[0]);
    //       this.player!.position = { x: e.pointer!.x, y: e.pointer!.y };
    //     }
    //   });

    // });

    // Enable zoom functionality
    this.enableZoom();

    // Re-adjust when resizing
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.panToPlayer(); // Re-centers player
    });

    this.fabricCanvas.on('mouse:down', (e) => {
      this.isPanning = true;
      const evt = e.e as MouseEvent;
      this.lastPosX = evt.clientX;
      this.lastPosY = evt.clientY;
    });

    this.fabricCanvas.on('mouse:move', (e) => {
      if (!this.isPanning) return;

      const evt = e.e as MouseEvent;
      const delta = new fabric.Point(
        evt.clientX - this.lastPosX,
        evt.clientY - this.lastPosY
      );

      const zoom = this.fabricCanvas.getZoom();

      // Use maps real size
      const canvasWidth = MAP_WIDTH * zoom;
      const canvasHeight = MAP_HEIGHT * zoom;

      const sidebarWidth = window.innerWidth * SIDEBAR_WIDTH; // Sidebar has 16% of screen width
      const viewportWidth = window.innerWidth - sidebarWidth;

      const viewport = this.fabricCanvas.viewportTransform!;

      // Calculating actual drag limits (based on map and window)
      const minX = Math.min(0, viewportWidth - canvasWidth);
      const minY = Math.min(0, window.innerHeight - canvasHeight);

      let nextX = viewport[4] + delta.x;
      let nextY = viewport[5] + delta.y;

      // Applying drag limits to the right and up
      if (nextX > 0) nextX = 0; // Left limit
      if (nextY > 0) nextY = 0; // Top limit
      if (nextX < minX) nextX = minX; // Right limit
      if (nextY < minY) nextY = minY; // Bottom limit

      viewport[4] = nextX;
      viewport[5] = nextY;

      this.fabricCanvas.setViewportTransform(viewport);

      this.lastPosX = evt.clientX;
      this.lastPosY = evt.clientY;

      this.updateVisibleArea();
    });

    this.fabricCanvas.on('mouse:up', () => {
      this.isPanning = false;
    });

    // Centralizes player when P is pressed
    document.addEventListener('keydown', (e) => {
      if (e.key === 'p' || e.key === 'P') {
        this.panToPlayer();
      }
    });

    // Add your objects to the canvas after resizing
    this.renderPlayer();
    this.renderCities();
    this.panToPlayer(); // Centers on player when loading
  }

  animatePlayerMove(e: any, frameCallback?: () => void) {
    const zoom = this.fabricCanvas.getZoom();
    const panX = this.fabricCanvas.viewportTransform![4];
    const panY = this.fabricCanvas.viewportTransform![5];
  
    // Adjust targetX and targetY to correct for zoom and pan
    const targetX = (e.pointer!.x - panX) / zoom;
    const targetY = (e.pointer!.y - panY) / zoom;
  
    // Get current player marker position in world coordinates
    const currentX = (this.playerMarker!.left! - panX) / zoom;
    const currentY = (this.playerMarker!.top! - panY) / zoom;
  
    // Calculate distance between current and target position
    const distanceX = targetX - currentX;
    const distanceY = targetY - currentY;
  
    // Use Pythagorean theorem to calculate total distance
    const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  
    // Set a consistent duration based on distance
    const duration = totalDistance * 100 / this.player?.currentStats.speed!; // Adjust this factor to control speed
  
    // Calculate the number of frames for 12 FPS
    const fps = 12;
    const frameDuration = 1000 / fps;
    const totalFrames = Math.ceil(duration / frameDuration);
  
    // Initialize the current frame
    let currentFrame = 0;
  
    // Function to update player position for each frame
    const animateFrame = () => {
      if (currentFrame < totalFrames) {
        const progress = currentFrame / totalFrames;
  
        // Interpolate position in world coordinates
        const newX = currentX + progress * distanceX;
        const newY = currentY + progress * distanceY;
  
        // Update the marker position in world coordinates, considering zoom and pan offsets
        this.playerMarker!.set({
          left: newX * zoom + panX,
          top: newY * zoom + panY,
        });
  
        this.fabricCanvas.renderAll();
  
        // Call the frame callback to update other animations
        if (frameCallback) frameCallback();
  
        currentFrame++;
        setTimeout(() => {
          requestAnimationFrame(animateFrame);
        }, frameDuration);
      } else {
        // Finalize position when animation is complete
        this.playerMarker!.set({
          left: targetX * zoom + panX,
          top: targetY * zoom + panY,
        });
        this.fabricCanvas.renderAll();
  
        // Update player position after animation completes
        this.player!.position = { x: targetX, y: targetY };
        this.enterLocation.emit(
          this.cities.find(city => city.x === targetX && city.y === targetY)!
        );
      }
    };
  
    // Start the animation
    animateFrame();
  }
  
  

  enableZoom() {
    this.fabricCanvas.on('mouse:wheel', (opt) => {
      const event = opt.e as WheelEvent;
      const delta = event.deltaY;
      let zoom = this.fabricCanvas.getZoom();

      // Calculate the sidebar width
      const sidebarWidth = window.innerWidth * SIDEBAR_WIDTH;

      // Calculate the minimum zoom level, considering the sidebar
      const zoomMin = Math.min(
        (window.innerWidth - sidebarWidth) / MAP_WIDTH, // Adjust for the window width minus the sidebar
        window.innerHeight / MAP_HEIGHT // Adjust for the window height
      );

      // Adjust zoom by multiplying by the delta factor
      zoom *= 0.999 ** delta;

      // Limit the zoom between the minimum (zoomMin) and maximum (20)
      if (zoom > 20) zoom = 20;
      if (zoom < zoomMin) zoom = zoomMin; // Zoom can't be smaller than necessary to show the whole map

      const zoomPoint = new fabric.Point(event.offsetX, event.offsetY);
      this.fabricCanvas.zoomToPoint(zoomPoint, zoom);

      event.preventDefault();
      event.stopPropagation();

      // Adjust the viewport after zooming and update the visible area
      this.fixViewportOnZoom(zoom);
      this.updateVisibleArea();
    });
  }

  fixViewportOnZoom(zoom: number) {
    const viewport = this.fabricCanvas.viewportTransform!;

    const sidebarWidth = window.innerWidth * SIDEBAR_WIDTH;
    const canvasWidth = MAP_WIDTH * zoom;
    const canvasHeight = MAP_HEIGHT * zoom;
    const viewportWidth = window.innerWidth - sidebarWidth;
    const viewportHeight = window.innerHeight;

    // Calculate the boundaries to keep the canvas centered
    const minX = Math.min(0, viewportWidth - canvasWidth);
    const minY = Math.min(0, viewportHeight - canvasHeight);

    if (viewport[4] > 0) viewport[4] = 0; // Left limit
    if (viewport[5] > 0) viewport[5] = 0; // Top limit
    if (viewport[4] < minX) viewport[4] = minX; // Right limit
    if (viewport[5] < minY) viewport[5] = minY; // Bottom limit

    this.fabricCanvas.setViewportTransform(viewport);
    this.fabricCanvas.renderAll();
  }

  resizeCanvas() {
    const sidebarWidth = document.querySelector('aside')?.clientWidth || 0;

    this.fabricCanvas.setWidth(window.innerWidth - sidebarWidth);
    this.fabricCanvas.setHeight(window.innerHeight);

    const zoom = this.fabricCanvas.getZoom();
    this.fixViewportOnZoom(zoom);

    // Atualiza a área visível após o redimensionamento
    this.updateVisibleArea();
  }

  panToPlayer() {
    const x = this.player!.position.x;
    const y = this.player!.position.y;

    const zoom = this.fabricCanvas.getZoom();
    const sidebarWidth = window.innerWidth * SIDEBAR_WIDTH; // Sidebar has 16% of width
    const viewportWidth = window.innerWidth - sidebarWidth;
    const viewportHeight = window.innerHeight;

    const canvasWidth = MAP_WIDTH * zoom;
    const canvasHeight = MAP_HEIGHT * zoom;

    const viewport = this.fabricCanvas.viewportTransform!;

    // Calculate the player be inside bounds
    let playerX = x * zoom - viewportWidth / 2;
    let playerY = y * zoom - viewportHeight / 2;

    // Make sure player doesn't leave the boundaries
    const minX = 0;
    const minY = 0;
    const maxX = canvasWidth - viewportWidth;
    const maxY = canvasHeight - viewportHeight;

    if (playerX < minX) playerX = minX; // Left limit
    if (playerY < minY) playerY = minY; // Top limit
    if (playerX > maxX) playerX = maxX; // Right limit
    if (playerY > maxY) playerY = maxY; // Bottom limit

    viewport[4] = -playerX;
    viewport[5] = -playerY;

    this.fabricCanvas.setViewportTransform(viewport);
    this.fabricCanvas.requestRenderAll();

    // Update visible area after panning to the player
    this.updateVisibleArea();
  }

  // Function to pan the canvas to a specific position (x, y)
  panToPosition(x: number, y: number) {
    // Get the center of the canvas
    const canvasCenter = new fabric.Point(
      this.fabricCanvas.getWidth() / 2,
      this.fabricCanvas.getHeight() / 2
    );

    // Point you want to pan to
    const targetPoint = new fabric.Point(x, y);

    // Pan to make targetPoint the center of the canvas
    this.fabricCanvas.absolutePan(targetPoint.subtract(canvasCenter));

    // Render the canvas after the panning
    this.fabricCanvas.requestRenderAll();

    // Update the visible area after panning
    this.updateVisibleArea();
  }

  updateVisibleObjects() {
    this.fabricCanvas.getObjects().forEach((obj) => {
      const objBounds = obj.getBoundingRect(true); // Get bounding rect of object, with true to apply transformations

      // Check if object is within the visible area
      const isInViewport =
        objBounds.left < this.visibleArea.right &&
        objBounds.top < this.visibleArea.bottom &&
        objBounds.left + objBounds.width > this.visibleArea.left &&
        objBounds.top + objBounds.height > this.visibleArea.top;

      // Update object visibility
      obj.set('visible', isInViewport);
    });

    // Render the canvas after updating visibility
    this.fabricCanvas.requestRenderAll();
  }

  updateVisibleArea() {
    const viewport = this.fabricCanvas.viewportTransform!;
    const zoom = this.fabricCanvas.getZoom();

    // Calculate the sidebar width
    const sidebarWidth = window.innerWidth * SIDEBAR_WIDTH;

    // The visible area should take into account the zoom and the viewport offsets
    this.visibleArea.left = Math.max(-10, -viewport[4] / zoom + 10);
    this.visibleArea.top = Math.max(-10, -viewport[5] / zoom +10);

    // Correct the calculation for the right and bottom edges
    this.visibleArea.right = Math.min(
      MAP_WIDTH,
      this.visibleArea.left + (window.innerWidth - sidebarWidth) / zoom
    );
    this.visibleArea.bottom = Math.min(
      MAP_HEIGHT,
      this.visibleArea.top + window.innerHeight / zoom
    );

    // Ensure visible objects are updated based on the new visible area
    this.updateVisibleObjects();
  }

  renderTileGrid() {
    const rows = this.fabricCanvas.height! / TILE_SIZE; // Number of rows
    const cols = this.fabricCanvas.width! / TILE_SIZE; // Number of columns

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const rect = new fabric.Rect({
          left: col * TILE_SIZE,
          top: row * TILE_SIZE,
          width: TILE_SIZE,
          height: TILE_SIZE,
          fill: 'transparent', // Make it invisible
          stroke: 'green',
          borderColor: 'green',
          selectable: false,
          hoverCursor: 'pointer',
        });
        this.fabricCanvas.add(rect);
      }
    }

    // // Render all tiles into a single image
    // this.fabricCanvas.renderAll();

    // // Convert the canvas to a data URL (image)
    // const tileGridImage = this.fabricCanvas.toDataURL({
    //   format: 'png',
    //   quality: 1.0
    // });

    // // Clear canvas of all tile objects
    // this.fabricCanvas.clear();

    // // Set background to the grid image
    // fabric.Image.fromURL(tileGridImage, (img) => {
    //   this.fabricCanvas.setBackgroundImage(img, this.fabricCanvas.renderAll.bind(this.fabricCanvas));
    // });
  }

  travelDuration(to: number, from: number): number {
    const baseDuration = 5000;
    const distance = Math.abs(to - from);
    return baseDuration * (distance / 100);
  }

  transformTop(top: number): number {
    return this.fabricCanvas.vptCoords!.tl.y + top;
  }

  transformLeft(left: number): number {
    return this.fabricCanvas.vptCoords!.tl.x + left;
  }

  // easeLinear(t: number, b: number, c: number, d: number) { return (c/2)+(-c + ((c/d)*t)); }

  renderPlayer() {
    if (!this.fabricCanvas) return;
    if (!this.player) return;

    this.playerMarker = new fabric.Rect({
      top: this.player!.position.y,
      left: this.player!.position.x,
      width: 10,
      height: 10,
      fill: 'red',
      selectable: false,
      hasBorders: false,
      hoverCursor: 'pointer',
    });

    this.fabricCanvas.add(this.playerMarker);
  }

  playerInCity(city: ILocation): boolean {
    if (!this.player) return false;
    return (
      this.player.position.x === city.x && this.player.position.y === city.y
    );
  }

  renderCities() {
    if (!this.fabricCanvas) return;

    this.cities.forEach((city) => {
      const playerInCity = this.playerInCity(city);
      const rect = new fabric.Rect({
        top: city.y,
        left: city.x,
        width: city.size * TILE_SIZE,
        height: city.size * TILE_SIZE,
        fill: 'black',
        stroke: playerInCity ? 'red' : 'white',
        borderColor: playerInCity ? 'red' : 'white',
        selectable: false,
        hasBorders: false,
        hoverCursor: 'pointer',
      });

      const name = new fabric.Text(city.name, {
        top: city.y + rect.height! + 10,
        left: city.x,
        fill: playerInCity ? 'red' : 'white',
        width: rect.width,
        fontFamily: 'Press Start 2P',
        fontSize: 12,
        textAlign: 'center',
        hoverCursor: 'pointer',
        selectable: false,
      });

      name.on('mouseover', () => {
        this.mouseOverCity.emit(city);
      });

      rect.on('mouseover', () => {
        this.mouseOverCity.emit(city);
      });

      rect.on('mouseleave', () => {
        this.mouseOverCity.emit(null);
      });

      rect.on('mousedblclick', () => {
        this.fastTravelTo.emit(city);
      });
      


      rect.on('mousedown', () => {
        if (this.playerInCity(city)) {
          this.enterLocation.emit(city);
        } else {
          this.animatePlayerMove({ pointer: { x: city.x, y: city.y } });
        }
      });

      this.fabricCanvas.add(rect, name);
    });
  }
}
