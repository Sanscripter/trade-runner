import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveViewComponent } from './interactive-view.component';

describe('InteractiveViewComponent', () => {
  let component: InteractiveViewComponent;
  let fixture: ComponentFixture<InteractiveViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractiveViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InteractiveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
