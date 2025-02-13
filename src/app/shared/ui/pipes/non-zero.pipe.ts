import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nonZero',
  standalone: true
})
export class NonZeroPipe implements PipeTransform {

  transform(value: number): string | null {
    return value !== 0 ? value.toString() : null;
  }
}
