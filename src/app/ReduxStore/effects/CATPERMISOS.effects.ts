import { APIService } from './../../API.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { fromPromise } from 'rxjs/observable/fromPromise';
import * as CATPERMISOSActions from '../actions/CATPERMISOS.actions';

@Injectable()
export class CATPERMISOSEfffects {
  constructor(private actions$: Actions, private api: APIService) {}

  loadAUDGENPROCESO$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CATPERMISOSActions.LoadCATPERMISOS),
      mergeMap(({ consult }) => {
        if (consult) {
          return fromPromise(this.api.ListCATPERMISOS(consult.NEGOCIOS, consult.AREA, consult.ROL)).pipe(
            map(({ items }: any) =>
                CATPERMISOSActions.LoadCATPERMISOSuccess({
                    CATPERMISOS: items,
              })
            ),
            catchError((error) =>
              of(
                CATPERMISOSActions.LoadCATPERMISOError({ payload: error })
              )
            )
          );
        } else {
          return fromPromise(this.api.ListCATPERMISOS()).pipe(
            map(({ items }: any) =>
                CATPERMISOSActions.LoadCATPERMISOSuccess({
                    CATPERMISOS: items,
              })
            ),
            catchError((error) =>
              of(
                CATPERMISOSActions.LoadCATPERMISOError({ payload: error })
              )
            )
          );
        }
      })
    )
  );
}
