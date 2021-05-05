import { APIService } from './../../API.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { fromPromise } from 'rxjs/observable/fromPromise';
import * as CATPROCESOSActions from '../actions/CATPROCESO.actions';

@Injectable()
export class CATPROCESOSEfffects {
  constructor(private actions$: Actions, private api: APIService) {}

  loadCATPROCESO$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CATPROCESOSActions.LoadCATPROCESOS),
      mergeMap(({ consult }) => {
        if (consult) {
          return fromPromise(this.api.ListCATPROCESOS(consult.filter, consult.limit)).pipe(
            map(({ items }: any) =>
            CATPROCESOSActions.LoadCATPROCESOSuccess({
                CATPROCESOS: items,
              })
            ),
            catchError((error) =>
              of(
                CATPROCESOSActions.LoadCATPROCESOError({ payload: error })
              )
            )
          );
        } else {
          return fromPromise(this.api.ListCATPROCESOS()).pipe(
            map(({ items }: any) =>
            CATPROCESOSActions.LoadCATPROCESOSuccess({
                CATPROCESOS: items,
              })
            ),
            catchError((error) =>
              of(
                CATPROCESOSActions.LoadCATPROCESOError({ payload: error })
              )
            )
          );
        }
      })
    )
  );
}
