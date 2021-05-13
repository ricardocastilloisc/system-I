import {
  caragarCatalogosError,
  caragarCatalogosSucces,
  unSetCatalogos,
} from './../../actions/catalogos/catalogos.actions';
import { CATALOGO_INTERFACE } from './../../../model/catalogos/catalogo.model';

import { createReducer, on } from '@ngrx/store';
import { cargarCatalogos } from '../../actions';

export interface CatalogosState {
  catalogos: CATALOGO_INTERFACE[];
  loading: boolean;
  error: any;
}
export const catalogosState: CatalogosState = {
  catalogos: [],
  loading: false,
  error: null,
};

const _catalogosReducer = createReducer(
  catalogosState,
  on(cargarCatalogos, (state) => ({ ...state, loading: true })),
  on(caragarCatalogosSucces, (state, { catalogos }) => ({
    ...state,
    loading: false,
    catalogos: [...catalogos],
    error: null,
  })),
  on(unSetCatalogos, (state) => ({
    ...state,
    catalogos: null,
    loading: false,
    error: null,
  })),
  on(caragarCatalogosError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: {
      url: payload.url,
      name: payload.name,
      message: payload.message,
    },
  }))
);

export let catalogosReducer = (state, action) =>
  _catalogosReducer(state, action);

