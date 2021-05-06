import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quitarcoma'
})
export class QuitarcomaPipe implements PipeTransform {

  transform(palabraconcoma:string ): string {
    return palabraconcoma?Object.assign({},{palabraconcoma: palabraconcoma })['palabraconcoma'].split(',').join('  '):'';
  }

}
