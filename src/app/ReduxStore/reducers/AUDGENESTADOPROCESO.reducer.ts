import {  AUDGENESTADOPROCESO_INTERFACE} from './../../model/AUDGENESTADOPROCESO.model';
import { createReducer, on } from '@ngrx/store';
import {
  LoadAUDGENESTADOPROCESOS,
  LoadAUDGENESTADOPROCESOError,
  LoadAUDGENESTADOPROCESOSuccess,
  UnsetAUDGENESTADOPROCESO,
} from '../actions/AUDGENESTADOPROCESO.actions';

export interface AUDGENESTADOPROCESOtate {
  AUDGENESTADOPROCESO: AUDGENESTADOPROCESO_INTERFACE[];
  consult: any;
  error: any;
}
export const AUDGENESTADOPROCESOtate: AUDGENESTADOPROCESOtate = {
  AUDGENESTADOPROCESO: [],
  consult: null,
  error: null,
};

const _AUDGENESTADOPROCESOReducer = createReducer(
  AUDGENESTADOPROCESOtate,
  on(LoadAUDGENESTADOPROCESOS, (state, { consult }) => ({ ...state,  })),
  on(LoadAUDGENESTADOPROCESOSuccess, (state, { AUDGENESTADOPROCESOS }) => ({
    ...state,
    AUDGENESTADOPROCESO: [...AUDGENESTADOPROCESOS],
    error: null,
  })),
  on(UnsetAUDGENESTADOPROCESO, (state) => ({
    ...state,
    AUDGENESTADOPROCESO: null,
    error: null,
    consult: null,
  })),

  on(LoadAUDGENESTADOPROCESOError, (state, { payload }) => ({
    ...state,
    error: payload,
  }))
);

export let AUDGENESTADOPROCESOReducer = (state, action) =>
  _AUDGENESTADOPROCESOReducer(state, action);
