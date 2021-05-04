import { UsuarioListado } from '../model/usuarioLitsa.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'oredenascEmailusurios'
})
export class OredenascEmailusuriosPipe implements PipeTransform {

  transform( ListadoUsuarios: UsuarioListado[], key: string):  UsuarioListado[] {
    return [...ListadoUsuarios].sort((a, b) => {
      if (
        !a.Attributes.hasOwnProperty(key) ||
        !b.Attributes.hasOwnProperty(key)
      ) {
        // property doesn't exist on either object
        return 0;
      }

      const varA =
        typeof a.Attributes.email === 'string'
          ? a.Attributes.email.toUpperCase()
          : a.Attributes.email;
      const varB =
        typeof b.Attributes.email === 'string'
          ? b.Attributes.email.toUpperCase()
          : b.Attributes.email;

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
