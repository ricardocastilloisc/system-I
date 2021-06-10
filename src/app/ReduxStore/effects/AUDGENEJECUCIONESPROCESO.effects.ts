import { APIService } from './../../API.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { fromPromise } from 'rxjs/observable/fromPromise';
import * as AUDGENEJECUCIONESPROCESO from '../actions/AUDGENEJECUCIONESPROCESO.actions';

@Injectable()
export class AUDGENEJECUCIONESPROCESOEfffects {
  constructor(private actions$: Actions, private api: APIService) {}

  loadAUDGENEJECUCIONESPROCESO$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AUDGENEJECUCIONESPROCESO.LoadAUDGENEJECUCIONESPROCESO),
      mergeMap(({ consult }) => {
        if (consult) {
          return fromPromise(this.api.GetSiaGenAudEstadoProcesosDev(consult.ID_PROCESO)).pipe(
            map(( data : any) =>
                AUDGENEJECUCIONESPROCESO.LoadAUDGENEJECUCIONPROCESOSuccess({
                AUDGENEJECUCIONESPROCESO: data,
              })
            ),
            catchError((error) =>
              of(
                AUDGENEJECUCIONESPROCESO.LoadAUDGENEJECUCIONPROCESOError({ payload: error })
              )
            )
          );
        }
      })
    )
  );
}
