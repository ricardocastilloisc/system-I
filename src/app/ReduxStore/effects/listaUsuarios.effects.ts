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

          return fromPromise(this.UsuariosService.consultaUsuariosMultipleFactor(consulta)).pipe(
            map(
              (data:any) =>
                LoadListaUsuariosActions.LoadListaUsuariosSuccess({
                  ListaUsuarios: data
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

      })
    )
  );
}


