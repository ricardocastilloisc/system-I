import {
  caragarDetailCatalogosError,
  caragarDetailCatalogosSucces,
  cargarDetailCatalogos,
  loadingDetailCatalogos,
  unSetDetailCatalogos,
} from './../../actions/catalogos/catalogoDetail.actions';

import { createReducer, on } from '@ngrx/store';

export interface DetailCatalogosState {
  DetailCatalogos: any;
  error: any;
  loading: boolean;
}
export const DetailCatalogosState: DetailCatalogosState = {
  DetailCatalogos: [],
  error: null,
  loading: false,
};

const _DetailCatologosReducer = createReducer(
  DetailCatalogosState,
  on(loadingDetailCatalogos, (state) => ({
    ...state,
    loading: true,
  })),
  on(cargarDetailCatalogos, (state) => ({
    ...state,
  })),
  on(caragarDetailCatalogosSucces, (state, {DetailCatalogos}) => ({
    ...state,
    DetailCatalogos: DetailCatalogos,
    loading: false,
    error: null,
  })),
  on(caragarDetailCatalogosError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  })),
  on(unSetDetailCatalogos, (state) => ({
    ...state,
    loading: false,
    error: null,
    DetailCatalogos: [],
  }))
);

export let DetailCatologosReducer = (state, action) =>
  _DetailCatologosReducer(state, action);
