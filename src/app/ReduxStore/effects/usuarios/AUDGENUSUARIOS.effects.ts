import { APIService } from './../../../API.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { fromPromise } from 'rxjs/observable/fromPromise';
import * as AUDGENUSUARIOActions from '../../actions/usuarios/AUDGENUSUARIOS.actions';

@Injectable()
export class AUDGENUSUARIOSEfffects {
  constructor(private actions$: Actions, private api: APIService) {}

  loadAUDGENUSUARIO$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AUDGENUSUARIOActions.LoadAUDGENUSUARIOS),
      mergeMap(({ consult }) => {
          console.log(consult)
        if (consult) {
          return fromPromise(this.api.ListAUDGENUSUARIOS(consult.MODULO)).pipe(
            map(({ items }: any) =>
                AUDGENUSUARIOActions.LoadAUDGENUSUARIOSuccess({
                AUDGENUSUARIOS: items,
              })
            ),
            catchError((error) =>
              of(
                AUDGENUSUARIOActions.LoadAUDGENUSUARIOError({ payload: error })
              )
            )
          );
        } else {
          return fromPromise(this.api.ListAUDGENUSUARIOS()).pipe(
            map(({ items }: any) =>
            AUDGENUSUARIOActions.LoadAUDGENUSUARIOSuccess({
                AUDGENUSUARIOS: items,
              })
            ),
            catchError((error) =>
              of(
                AUDGENUSUARIOActions.LoadAUDGENUSUARIOError({ payload: error })
              )
            )
          );
        }
      })
    )
  );
}