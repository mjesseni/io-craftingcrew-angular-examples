import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'duration'
})
export class DurationPipe implements PipeTransform {

    transform(value: number | undefined | null): string | null {
        if (value === null || value === undefined || value < 0 || value === 0) return null;

        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        const seconds = Math.floor(value % 60);

        const format = (num: number, size = 1) => num.toString().padStart(size, '0');
        if (hours) {
            return `${hours} h ${format(minutes)} min ${format(seconds)} sec`;
        } else if (!hours && minutes) {
            return `${format(minutes)} min ${format(seconds)} sec`;
        } else {
            return `${format(seconds)} sec`;
        }
    }
}
