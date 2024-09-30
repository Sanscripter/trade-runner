import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import ICity from '../../utils/ICity.interface';
import { Player } from '../../game/Player';


const TILE_SIZE = 20;
const MAP_WIDTH = 2400;
const MAP_HEIGHT = 1200;

@Component({
  selector: 'app-interactive-view',
  templateUrl: './interactive-view.component.html',
  styleUrls: ['./interactive-view.component.scss']
})
export class InteractiveViewComponent implements AfterViewInit {

  canvasCtx: CanvasRenderingContext2D | null = null;
  @ViewChild('interactiveViewCanvas')
  canvas!: HTMLCanvasElement;
  fabricCanvas!: fabric.Canvas;
  mouseUp: any;


  @Input() cities: ICity[] = [];

  @Input() player?: Player;

  @Output() travelledTo = new EventEmitter<ICity>();

  @Output() mouseOverCity = new EventEmitter<ICity | null>();

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

    this.visibleArea = {
      left: window.innerWidth / 6 + 100,
      top: 100,
      right: window.innerWidth - 100,
      bottom: window.innerHeight - 100,
    };
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

    this.fabricCanvas.on('mouse:down', (e) => {
      this.isPanning = true;
      const evt = e.e as MouseEvent;
      this.lastPosX = evt.clientX;
      this.lastPosY = evt.clientY;
    });

    this.fabricCanvas.on('mouse:move', (e) => {
      if (!this.isPanning) return;
      const evt = e.e as MouseEvent;
      const delta = new fabric.Point(evt.clientX - this.lastPosX, evt.clientY - this.lastPosY);
      this.fabricCanvas.relativePan(delta);
      this.lastPosX = evt.clientX;
      this.lastPosY = evt.clientY;
      // this.updateVisibleObjects();

    });

    this.fabricCanvas.on('mouse:up', () => {
      this.isPanning = false;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'p') {
        this.panToPlayer();
      }
    });



    //change to actual map size
    this.fabricCanvas.setWidth(MAP_WIDTH);
    this.fabricCanvas.setHeight(MAP_HEIGHT);
    this.fabricCanvas.add(new fabric.Rect({
      width: MAP_WIDTH,
      height: MAP_HEIGHT,
      fill: 'transparent',
      stroke: 'white',
      borderColor: 'white',
      selectable: false,
    }));
    // this.fabricCanvas.setBackgroundImage('assets/map.png', ()=> {this.fabricCanvas.renderAll()});

    // this.renderTileGrid();
    // this.updateVisibleObjects();



    // this.renderPlayer();

    this.renderCities();

    this.panToPlayer();

  }

  panToPlayer() {
    this.panToPosition(this.player!.position.x + window.innerWidth/3, this.player!.position.y + window.innerHeight/2);
  }


  // Function to pan the canvas to a specific position (x, y)
  panToPosition(x: number, y: number) {
    // Get the center of the canvas
    const canvasCenter = new fabric.Point(this.fabricCanvas.getWidth() / 2, this.fabricCanvas.getHeight() / 2);

    // Point you want to pan to
    const targetPoint = new fabric.Point(x, y);

    // Pan to make targetPoint the center of the canvas
    this.fabricCanvas.absolutePan(targetPoint.subtract(canvasCenter));


    // Render the canvas after the panning
    this.fabricCanvas.requestRenderAll();
  }


  updateVisibleObjects() {
    this.fabricCanvas.getObjects().forEach((obj) => {
      const objBounds = obj.getBoundingRect();  // Get the bounding box of the object

      const isInViewport =
        objBounds.left < this.visibleArea.right &&
        objBounds.top < this.visibleArea.bottom &&
        objBounds.left + objBounds.width > this.visibleArea.left &&
        objBounds.top + objBounds.height > this.visibleArea.top;

      // Hide objects that are not in the viewport
      if (!isInViewport) {
        obj.set('visible', false);  // Hide the object
      } else {
        obj.set('visible', true);   // Ensure the object is visible if it's in the viewport
      }
    });

    // Re-render the canvas
    this.fabricCanvas.requestRenderAll();
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
        rect.on('mousedown', () => {
          // alert('clicked'+ ` ${row}, ${col}`);
        });
        // rect.on('mouseover', () => { alert('mouseover'+ `${row}, ${col}`); });
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

    this.playerMarker = new fabric.Rect({
      top: this.player!.position.y,
      left: this.player!.position.x,

      width: 10,
      height: 10,
      fill: 'red',
      selectable: false,
      hasBorders: false,
      hoverCursor: 'pointer'
    });

    this.fabricCanvas.add(this.playerMarker);
  }

  playerInCity(city: ICity): boolean {
    if (!this.player) return false;
    return this.player.position.x === city.x && this.player.position.y === city.y;
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
        hoverCursor: 'pointer'
      });

      const name = new fabric.Text(city.name, {
        top: city.y + rect.height! + 10,
        left: city.x - rect.width! * .5,
        fill: playerInCity ? 'red' : 'white',
        width: rect.width,
        fontFamily: 'Press Start 2P',
        fontSize: 12,
        textAlign: 'center',
        hoverCursor: 'pointer',
        selectable: false
      })

      name.on('mouseover', () => {
        console.log('mouseover', city);
        this.mouseOverCity.emit(city);
      });

      rect.on('mouseover', () => {
        console.log('mouseover', city);
        this.mouseOverCity.emit(city);
      });

      rect.on('mouseleave', () => {
        this.mouseOverCity.emit(null);
      });

      rect.on('mousedown', () => {
        this.travelledTo.emit(city);
      });
      this.fabricCanvas.add(rect, name);
    });
  }
}
