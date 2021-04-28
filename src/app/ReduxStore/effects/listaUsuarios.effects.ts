import { APIService } from './../../API.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { fromPromise } from 'rxjs/observable/fromPromise';
import * as AUDGENPROCESOActions from '../actions/AUDGENPROCESO.actions';
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
      mergeMap(() =>
        fromPromise(this.UsuariosService.consultarUsuarios()).pipe(
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
        )
      )
    )
  );
}
