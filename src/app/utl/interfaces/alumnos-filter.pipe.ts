import { Pipe, PipeTransform } from '@angular/core';
import {AlumnosUtl} from './alumnosutl'; /*CHECAR*/

@Pipe({
  name: 'alumnoFilter',
  standalone: true
})
export class AlumnosFilterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
