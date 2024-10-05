import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaserInteractiveView } from './interactive-view.component';

describe('InteractiveViewComponent', () => {
  let component: PhaserInteractiveView;
  let fixture: ComponentFixture<PhaserInteractiveView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhaserInteractiveView]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhaserInteractiveView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
