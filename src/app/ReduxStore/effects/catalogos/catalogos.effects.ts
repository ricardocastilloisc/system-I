import { caragarCatalogosError } from './../../actions/catalogos/catalogos.actions';
import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { mergeMap, map, catchError } from 'rxjs/operators';

import { of } from 'rxjs';
import { CatalogosService } from '../../../services/catalogos.service';
import {
  caragarCatalogosSucces,
  cargarCatalogos,
} from '../../actions/catalogos/catalogos.actions';
//CatalogosService
@Injectable()
export class CatalogosEfffects {
  constructor(
    private actions$: Actions,
    private CatalogosService: CatalogosService
  ) {}

  cargarCatalogos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cargarCatalogos),
      mergeMap(() =>
        this.CatalogosService.getCatalogos().pipe(
          map(({ catalogos }: any) =>
            caragarCatalogosSucces({ catalogos: catalogos })
          ),
          catchError((error) => of(caragarCatalogosError({ payload: error })))
        )
      )
    )
  );
}
