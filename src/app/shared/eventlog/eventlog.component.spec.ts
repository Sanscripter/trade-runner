import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventlogComponent } from './eventlog.component';

describe('EventlogComponent', () => {
  let component: EventlogComponent;
  let fixture: ComponentFixture<EventlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventlogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
