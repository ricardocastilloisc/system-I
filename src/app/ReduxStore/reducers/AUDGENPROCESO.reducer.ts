import { AUDGENPROCESO_INERFACE } from './../../model/AUDGENPROCESO.model';
import { createReducer, on } from '@ngrx/store';
import { LoadAUDGENPROCESOS, LoadAUDGENPROCESOError, LoadAUDGENPROCESOSuccess, UnsetAUDGENPROCESO } from '../actions/AUDGENPROCESO.actions';


export interface AUDGENPROCESOState {
  AUDGENPROCESOS:AUDGENPROCESO_INERFACE[],
  consult:any,
  error: any;
}
export const AUDGENPROCESOState: AUDGENPROCESOState = {
  AUDGENPROCESOS:[],
  consult:null,
  error: null,
};

const _AUDGENPROCESOReducer = createReducer(
  AUDGENPROCESOState,
  on(LoadAUDGENPROCESOS, (state, {consult}) => ({ ...state })),
  on(LoadAUDGENPROCESOSuccess, (state, { AUDGENPROCESOS }) => ({
    ...state,
    AUDGENPROCESOS: [...AUDGENPROCESOS],
    error: null
  })),
  on(UnsetAUDGENPROCESO, (state) => ({
    ...state,
    AUDGENPROCESOS: null,
    error: null,
    consult: null
  })),

  on(LoadAUDGENPROCESOError, (state, {payload}) =>
  ({
    ...state,
    error: payload
  }))
);

export let AUDGENPROCESOReducer = (state, action) =>  _AUDGENPROCESOReducer(state, action)
