import { APIService } from './../../API.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { fromPromise } from 'rxjs/observable/fromPromise';
import * as AUDGENPROCESOActions from '../actions/AUDGENPROCESO.actions';

@Injectable()
export class AUDGENPROCESOSEfffects {
  constructor(private actions$: Actions, private api: APIService) {}

  loadAUDGENPROCESO$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AUDGENPROCESOActions.LoadAUDGENPROCESOS),
      mergeMap(({ consult }) => {
        if (consult) {
          console.log(consult)
          return fromPromise(this.api.ListAUDGENPROCESOS(consult.filter) ).pipe(
            map(({ items }: any) =>
              AUDGENPROCESOActions.LoadAUDGENPROCESOSuccess({
                AUDGENPROCESOS: items,
              })
            ),
            catchError((error) =>
              of(
                AUDGENPROCESOActions.LoadAUDGENPROCESOError({ payload: error })
              )
            )
          );
        } else {
          return fromPromise(this.api.ListAUDGENPROCESOS()).pipe(
            map(({ items }: any) =>
              AUDGENPROCESOActions.LoadAUDGENPROCESOSuccess({
                AUDGENPROCESOS: items,
              })
            ),
            catchError((error) =>
              of(
                AUDGENPROCESOActions.LoadAUDGENPROCESOError({ payload: error })
              )
            )
          );
        }
      })
    )
  );
}
