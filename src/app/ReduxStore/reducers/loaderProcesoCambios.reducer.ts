
import { createReducer, on } from '@ngrx/store';
import { ProcesoLimpiar, ProcesoTerminado } from '../actions/loaderProcesoCambios.actions';


export interface ProcesoCambiosState {
  terminado: boolean;
}
export const InitialProcesoCambiosState: ProcesoCambiosState = {
  terminado: false
};

const _ProcesoCambiosReducer = createReducer(
  InitialProcesoCambiosState,
  on(ProcesoTerminado, (state) => ({
    ...state,
    terminado: true,
  })),
  on(ProcesoLimpiar, (state) => ({
    ...state,
    terminado: false,
  })),
);

export let ProcesoCambiosReducer = (state, action) =>
  _ProcesoCambiosReducer(state, action);
