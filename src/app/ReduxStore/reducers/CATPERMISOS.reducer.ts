import { CATPERMISOS_INTERFACE } from './../../model/CATPERMISOS.model';
import { createReducer, on } from '@ngrx/store';
import {
    LoadCATPERMISOError,
    LoadCATPERMISOS,
    LoadCATPERMISOSuccess,
    UnsetCATPERMISO
} from '../actions/CATPERMISOS.actions';

export interface CATPERMISOState {
    CATPERMISOS: CATPERMISOS_INTERFACE[];
  consult: any;
  error: any;
}
export const CATPERMISOState: CATPERMISOState = {
    CATPERMISOS: [],
  consult: null,
  error: null,
};

const _CATPERMISOReducer = createReducer(
    CATPERMISOState,
  on(LoadCATPERMISOS, (state, { consult }) => ({ ...state,  })),
  on(LoadCATPERMISOSuccess, (state, { CATPERMISOS }) => ({
    ...state,
    CATPERMISOS: [...CATPERMISOS],
    error: null,
  })),
  on(UnsetCATPERMISO, (state) => ({
    ...state,
    AUDGENPROCESOS: null,
    error: null,
    consult: null,
  })),

  on(LoadCATPERMISOError, (state, { payload }) => ({
    ...state,
    error: payload,
  }))
);

export let CATPERMISOReducer = (state, action) =>
  _CATPERMISOReducer(state, action);
