import { AUDGENPROCESO_INERFACE } from './../../model/AUDGENPROCESO.model';
import { createReducer, on } from '@ngrx/store';
import {
  LoadAUDGENEJECUCIONESPROCESO,
  LoadAUDGENEJECUCIONPROCESOError,
  LoadAUDGENEJECUCIONPROCESOSuccess,
  UnsetAUDGENEJECUCIONPROCESO,
} from '../actions/AUDGENEJECUCIONESPROCESO.actions';

export interface AUDGENEJECUCIONESPROCESOState {
  AUDGENEJECUCIONESPROCESO: AUDGENPROCESO_INERFACE;
  consult: any;
  error: any;
}
export const AUDGENEJECUCIONESPROCESOState: AUDGENEJECUCIONESPROCESOState = {
  AUDGENEJECUCIONESPROCESO: null,
  consult: null,
  error: null,
};

const _AUDGENEJECUCIONESPROCESOReducer = createReducer(
    AUDGENEJECUCIONESPROCESOState,
  on(LoadAUDGENEJECUCIONESPROCESO, (state, { consult }) => ({ ...state,  })),
  on(LoadAUDGENEJECUCIONPROCESOSuccess, (state, { AUDGENEJECUCIONESPROCESO }) => ({
    ...state,
    AUDGENEJECUCIONESPROCESO: { ...AUDGENEJECUCIONESPROCESO},
    error: null,
  })),
  on(UnsetAUDGENEJECUCIONPROCESO, (state) => ({
    ...state,
    AUDGENEJECUCIONESPROCESO: null,
    error: null,
    consult: null,
  })),

  on(LoadAUDGENEJECUCIONPROCESOError, (state, { payload }) => ({
    ...state,
    error: payload,
  }))
);

export let AUDGENEJECUCIONESPROCESOReducer = (state, action) =>
  _AUDGENEJECUCIONESPROCESOReducer(state, action);
