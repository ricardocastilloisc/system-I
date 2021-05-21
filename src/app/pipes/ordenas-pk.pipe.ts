import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenasPk'
})
export class OrdenasPkPipe implements PipeTransform {

  transform( list: any[], key: string): any[] {
    return [...list].sort((a, b) => {

      if (
        !a.hasOwnProperty(key) ||
        !b.hasOwnProperty(key)
      ) {
        
        return 0;
      }

      let varA =
        typeof a[key] === 'string'
          ? a[key].toUpperCase()
          : a[key];
      let varB =
        typeof b[key] === 'string'
          ? b[key].toUpperCase()
          : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return comparison;
    })
  }

}
