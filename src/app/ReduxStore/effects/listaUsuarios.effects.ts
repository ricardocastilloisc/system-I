import { ValorFiltrarGrupo } from './../../validators/opcionesDeFiltroUsuarioAdmininistracion';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { UsuariosService } from '../../services/usuarios.service';
import * as LoadListaUsuariosActions from '../actions/listaUsuarios.actions';

@Injectable()
export class ListadoUsuariosEfffects {
  constructor(
    private actions$: Actions,
    private UsuariosService: UsuariosService
  ) {}

  listadoUsuarios$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadListaUsuariosActions.LoadListaUsuarios),
      mergeMap(({ consulta }) => {
        if (!consulta) {
          return fromPromise(this.UsuariosService.consultarUsuarios()).pipe(
            map(
              (data) =>
                LoadListaUsuariosActions.LoadListaUsuariosSuccess({
                  ListaUsuarios: this.UsuariosService.reformatearArrayDeUsuarios(
                    data
                  ),
                }),
              catchError((error) =>
                of(
                  LoadListaUsuariosActions.LoadListaUsuariosError({
                    payload: error,
                  })
                )
              )
            )
          );
        } else {
          /* aqui se va definir los tipos
el tipo uno es para consulta  por grupo
*/
          switch (consulta.tipo) {
            case ValorFiltrarGrupo.Grupo:
              return fromPromise(
                this.UsuariosService.consultarUsuariosEnGrupo(
                  consulta.parametro
                )
              ).pipe(
                map(
                  (data) =>
                    LoadListaUsuariosActions.LoadListaUsuariosSuccess({
                      ListaUsuarios: this.UsuariosService.reformatearArrayDeUsuarios(
                        data
                      ),
                    }),
                  catchError((error) =>
                    of(
                      LoadListaUsuariosActions.LoadListaUsuariosError({
                        payload: error,
                      })
                    )
                  )
                )
              );

            default:
              break;
          }
        }
      })
    )
  );
}


