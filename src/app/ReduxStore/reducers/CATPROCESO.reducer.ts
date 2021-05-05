import { CATPROCESOS_INTERFACE } from './../../model/CATPROCESOS.model';
import { createReducer, on } from '@ngrx/store';
import {
  LoadCATPROCESOError,
  LoadCATPROCESOS,
  LoadCATPROCESOSuccess,
  UnsetCATPROCESO
} from '../actions/CATPROCESO.actions';

export interface CATPROCESOState {
  CATPROCESOS: CATPROCESOS_INTERFACE[];
  consult: any;
  error: any;
}
export const CATPROCESOState: CATPROCESOState = {
  CATPROCESOS: [],
  consult: null,
  error: null,
};

const _CATPROCESOReducer = createReducer(
    CATPROCESOState,
  on(LoadCATPROCESOS, (state, { consult }) => ({ ...state,  })),
  on(LoadCATPROCESOSuccess, (state, { CATPROCESOS }) => ({
    ...state,
    CATPROCESOS: [...CATPROCESOS],
    error: null,
  })),
  on(UnsetCATPROCESO, (state) => ({
    ...state,
    CATPROCESOS: null,
    error: null,
    consult: null,
  })),

  on(LoadCATPROCESOError, (state, { payload }) => ({
    ...state,
    error: payload,
  }))
);

export let CATPROCESOReducer = (state, action) =>
  _CATPROCESOReducer(state, action);
