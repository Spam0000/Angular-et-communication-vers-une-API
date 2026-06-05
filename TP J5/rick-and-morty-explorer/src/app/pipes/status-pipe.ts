import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true,
})
export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'Alive') {
      return '🟢 Vivant';
    }
    if (value === 'Dead') {
      return '🔴 Mort';
    }
    return '⚪ Inconnu';
  }
}
