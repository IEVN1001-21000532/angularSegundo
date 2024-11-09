import { Pipe, PipeTransform } from '@angular/core';
import {AlumnosUtl} from './interfaces/alumnosutl'; /*CHECAR*/

@Pipe({
  name: 'alumnosFilter',
  standalone: true
})
export class AlumnosFilterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
