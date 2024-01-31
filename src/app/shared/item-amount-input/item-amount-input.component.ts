import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl, ValidationErrors, NG_VALIDATORS, Validator } from '@angular/forms';

@Component({
  selector: 'app-item-amount-input',
  templateUrl: './item-amount-input.component.html',
  styleUrl: './item-amount-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ItemAmountInputComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ItemAmountInputComponent
    }
  ]
})
export class ItemAmountInputComponent implements ControlValueAccessor, Validator {

  onChange = (value: number) => { };
  onTouched = () => { };
  touched = false;
  disabled = false;

  @Input() currentMax: number = 1;
  @Output() change = new EventEmitter<number>();

  value: number = 0;

  constructor() { }

  writeValue(value: number): void {
    this.value = value;
  }
  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const quantity = control.value;
    if (quantity <= 0) {
      return {
        mustBePositive: {
          quantity
        }
      };
    }
    return null;
  }

  increase() {
    this.markAsTouched();
    this.value = this.value + 1;
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  decrease() {
    this.markAsTouched();
    this.value = this.value - 1;
    this.onChange(this.value);
    this.change.emit(this.value);
  }


}
