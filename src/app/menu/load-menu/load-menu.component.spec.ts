import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadMenuComponent } from './load-menu.component';

describe('LoadMenuComponent', () => {
  let component: LoadMenuComponent;
  let fixture: ComponentFixture<LoadMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
