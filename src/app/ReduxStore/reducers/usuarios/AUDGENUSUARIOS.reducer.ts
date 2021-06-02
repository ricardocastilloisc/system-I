import { AUDGENUSUARIO_INTERFACE } from './../../../model/AUDGENUSUARIO.model';
import { createReducer, on } from '@ngrx/store';
import {
    LoadAUDGENUSUARIOS,
    LoadAUDGENUSUARIOError,
    LoadAUDGENUSUARIOSuccess,
    UnsetAUDGENUSUARIO,
} from '../../actions/usuarios/AUDGENUSUARIOS.actions';

export interface AUDGENUSUARIOState {
    AUDGENUSUARIOS: AUDGENUSUARIO_INTERFACE[];
  consult: any;
  error: any;
}
export const AUDGENUSUARIOSState: AUDGENUSUARIOState = {
    AUDGENUSUARIOS: [],
  consult: null,
  error: null,
};

const _AUDGENUSUARIOReducer = createReducer(
    AUDGENUSUARIOSState,
  on(LoadAUDGENUSUARIOS, (state, { consult }) => ({ ...state,  })),
  on(LoadAUDGENUSUARIOSuccess, (state, { AUDGENUSUARIOS }) => ({
    ...state,
    AUDGENUSUARIOS: [...AUDGENUSUARIOS],
    error: null,
  })),
  on(UnsetAUDGENUSUARIO, (state) => ({
    ...state,
    AUDGENUSUARIOS: null,
    error: null,
    consult: null,
  })),

  on(LoadAUDGENUSUARIOError, (state, { payload }) => ({
    ...state,
    error: payload,
  }))
);

export let AUDGENUSUARIOReducer = (state, action) =>
  _AUDGENUSUARIOReducer(state, action);
