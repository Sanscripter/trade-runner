import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import ICity from '../../utils/ICity.interface';
import { Player } from '../../game/Player';

@Component({
  selector: 'app-interactive-view',
  templateUrl: './interactive-view.component.html',
  styleUrls: ['./interactive-view.component.scss']
})
export class InteractiveViewComponent implements AfterViewInit {

  canvasCtx: CanvasRenderingContext2D | null = null;
  canvas!: HTMLCanvasElement;
  fabricCanvas!: fabric.Canvas;
  mouseUp: any;


  @Input() cities: ICity[] = [];

  @Input() player?: Player;

  @Output() travelledTo = new EventEmitter<ICity>();


  playerMarker?: fabric.Rect;


  isPanning: boolean = false;
  selection: boolean = false;
  lastPosX: number = 0;
  lastPosY: number = 0;

  ngAfterViewInit(): void {
    this.fabricCanvas = new fabric.Canvas('interactiveViewCanvas', {
      backgroundColor: 'black',
      selection: false,
      preserveObjectStacking: true,
    });

    this.fabricCanvas.on('mouse:dblclick', (e) => {
      console.log(e.pointer, 'dblclick');
      return;


      // this.playerMarker!.top = e.pointer!.y;
      // this.playerMarker!.left = e.pointer!.x;
      this.playerMarker?.animate('top', this.transformTop(e.pointer!.y), {
        duration: this.travelDuration(e.pointer!.y, this.player!.position.y),
        easing: fabric.util.ease.easeOutCubic,
        onChange: () => {
          this.fabricCanvas.renderAll();
        },
        onComplete: () => {
          // this.fabricCanvas.absolutePan(this.playerMarker!.getCoords()[0]);

          this.player!.position = { x: e.pointer!.x, y: e.pointer!.y };
        }
      });

      this.playerMarker?.animate('left', this.transformLeft(e.pointer!.x), {
        duration: this.travelDuration(e.pointer!.x, this.player!.position.x),
        easing: fabric.util.ease.easeOutCubic,
        onChange: () => {
          this.fabricCanvas.renderAll();
        },
        onComplete: () => {
          // this.fabricCanvas.absolutePan(this.playerMarker!.getCoords()[0]);
          this.player!.position = { x: e.pointer!.x, y: e.pointer!.y };
        }
      });

    });


    this.fabricCanvas.on('mouse:move', (e) => {
      if (!this.isPanning) return;
      const evt = e.e as MouseEvent;
      const delta = new fabric.Point(evt.movementX, evt.movementY);
      this.fabricCanvas.relativePan(delta);
    });

    this.fabricCanvas.on('mouse:up', (e) => {
      this.isPanning = false;
    });

    this.fabricCanvas.on('mouse:down', (e) => {
      this.isPanning = true;
    });

    // this.fabricCanvas.absolutePan()
    this.fabricCanvas.setWidth(window.innerWidth * 2);
    this.fabricCanvas.setHeight(window.innerHeight * 2);
    // this.fabricCanvas.setBackgroundImage('assets/map.png', ()=> {this.fabricCanvas.renderAll()});

    // this.renderPlayer();

    this.renderCities();

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

  renderCities() {
    if (!this.fabricCanvas) return;

    this.cities.forEach((city) => {
      const rect = new fabric.Rect({
        top: city.y,
        left: city.x,
        width: city.size * .6 + 10,
        height: city.size * .7 + 10,
        fill: 'black',
        stroke: 'white',
        borderColor: 'white',
        selectable: false,
        hasBorders: false,
        hoverCursor: 'pointer'
      });

      const name = new fabric.Text(city.name, {
        top: city.y + rect.height! + 10,
        left: city.x - rect.width! * .5,
        fill: 'white',
        width: rect.width,
        fontFamily: 'Press Start 2P',
        fontSize: 12,
        textAlign: 'center',
        hoverCursor: 'pointer',
        selectable: false
      })

      rect.on('mousedown', () => {
        this.travelledTo.emit(city);
      });
      this.fabricCanvas.add(rect, name);
    });
  }
}
