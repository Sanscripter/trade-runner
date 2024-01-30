import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAmountInputComponent } from './item-amount-input.component';

describe('ItemAmountInputComponent', () => {
  let component: ItemAmountInputComponent;
  let fixture: ComponentFixture<ItemAmountInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemAmountInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemAmountInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
