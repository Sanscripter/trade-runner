import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import ICity from '../../utils/ICity.interface';

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

  @Output() travelledTo = new EventEmitter<ICity>();

  ngAfterViewInit(): void {
    this.fabricCanvas = new fabric.Canvas('interactiveViewCanvas', {
      backgroundColor: 'black',
      selection: false,
      preserveObjectStacking: true,
    });
    this.renderCities();
  }

  initializeCanvas() {
    this.canvas = document.getElementById('interactiveViewCanvas') as HTMLCanvasElement;
    this.canvasCtx = this.canvas?.getContext('2d') || null;
    if (!this.canvasCtx) {
      console.error('Error initializing canvas');
      return;
    }
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
        stroke : 'white',
        borderColor: 'white',
        selectable: false,
        hasBorders: false,
        hoverCursor:'pointer'
      });

      const name = new fabric.Text(city.name, {
        top: city.y + rect.height! + 10,
        left: city.x - rect.width! * .5,
        fill: 'white',
        width: rect.width,
        fontFamily: 'Press Start 2P',
        fontSize: 12,
        textAlign: 'center',
        hoverCursor: 'pointer'
      })

      rect.on('mousedown', () => {
        this.travelledTo.emit(city);
      });
      this.fabricCanvas.add(rect, name);
    });
  }
}
