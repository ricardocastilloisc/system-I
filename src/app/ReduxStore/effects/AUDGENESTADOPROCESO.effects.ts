import { APIService } from './../../API.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { fromPromise } from 'rxjs/observable/fromPromise';
import * as AUDGENESTADOPROCESOActions from '../actions/AUDGENESTADOPROCESO.actions';

@Injectable()
export class AUDGENESTADOPROCESOEfffects {
  constructor(private actions$: Actions, private api: APIService) {}

  loadAUDGENPROCESO$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AUDGENESTADOPROCESOActions.LoadAUDGENESTADOPROCESOS),
      mergeMap(({ consult }) => {
        if (consult) {
          return fromPromise(this.api.ListSiaGenAudEstadoProcesosDevs(consult.INTERFAZ, consult.FECHA_INICIO, consult.FECHA_FIN, consult.ID_PROCESO)).pipe(
            map(({ items }: any) =>
            AUDGENESTADOPROCESOActions.LoadAUDGENESTADOPROCESOSuccess({
                AUDGENESTADOPROCESOS: items,
              })
            ),
            catchError((error) =>
              of(
                AUDGENESTADOPROCESOActions.LoadAUDGENESTADOPROCESOError({ payload: error })
              )
            )
          );
        } else {
          return fromPromise(this.api.ListSiaGenAudEstadoProcesosDevs()).pipe(
            map(({ items }: any)  =>
            AUDGENESTADOPROCESOActions.LoadAUDGENESTADOPROCESOSuccess({
                AUDGENESTADOPROCESOS: items,
              })
            ),
            catchError((error) =>
              of(
                AUDGENESTADOPROCESOActions.LoadAUDGENESTADOPROCESOError({ payload: error })
              )
            )
          );
        }
      })
    )
  );
}
