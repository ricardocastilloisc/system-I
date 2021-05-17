import { caragarCatalogosError } from './../../actions/catalogos/catalogos.actions';
import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { mergeMap, map, catchError } from 'rxjs/operators';

import { of } from 'rxjs';
import { CatalogosService } from '../../../services/catalogos.service';

import { caragarDetailCatalogosError, caragarDetailCatalogosSucces, cargarDetailCatalogos } from '../../actions';
//CatalogosService
@Injectable()
export class CatalogoDetailEfffects {
  constructor(
    private actions$: Actions,
    private CatalogosService: CatalogosService
  ) {}

  cargarDetailCatalogos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cargarDetailCatalogos),
      mergeMap(() =>
        this.CatalogosService.getDetailsCat().pipe(
          map(({ registros }: any) =>
          caragarDetailCatalogosSucces({ DetailCatalogos: registros })
          ),
          catchError((error) => of(caragarDetailCatalogosError({ payload: error })))
        )
      )
    )
  );
}
