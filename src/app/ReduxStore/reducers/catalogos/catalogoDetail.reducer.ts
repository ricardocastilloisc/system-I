import {
  caragarDetailCatalogosError,
  caragarDetailCatalogosSucces,
  cargarDetailCatalogos,
  loadingDetailCatalogos,
  unSetDetailCatalogos,
} from './../../actions/catalogos/catalogoDetail.actions';

import { createReducer, on } from '@ngrx/store';
import { loadingCompleteDetailCatalogos } from '../../actions/catalogos/catalogoDetail.actions';

export interface DetailCatalogosState {
  DetailCatalogos: any;
  error: any;
  loading: boolean;
  token: string;
}
export const DetailCatalogosState: DetailCatalogosState = {
  DetailCatalogos: [],
  error: null,
  loading: false,
  token: null
};

const _DetailCatologosReducer = createReducer(
  DetailCatalogosState,
  on(loadingDetailCatalogos, (state) => ({
    ...state,
    loading: true,
  })),
  on(cargarDetailCatalogos, (state, {token}) => ({
    ...state,
    token: token,
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
  on(loadingCompleteDetailCatalogos, (state) => ({
    ...state,
    loading: false,
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
