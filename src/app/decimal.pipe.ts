import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'oneDecimalPlace',
})
export class OneDecimalPlacePipe implements PipeTransform {
  transform(value: number): string {
    // Check if the value is a valid number
    if (!isNaN(value) && value !== null) {
      // Use toFixed(1) to round to one decimal place
      return value.toFixed(1);
    }

    // Return the original value if it's not a valid number
    return value.toString();
  }
}
