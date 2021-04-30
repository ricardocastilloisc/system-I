
import { ActionReducerMap } from '@ngrx/store'
import * as reducers from './reducers'
export interface AppState {
  usuario: reducers.UserState,
  AUDGENPROCESOS: reducers.AUDGENPROCESOState,
  ListaUsuarios: reducers.ListaUsuariosState,
  ProcesoCambios: reducers.ProcesoCambiosState
}

export const appReducers:ActionReducerMap<AppState> = {
  usuario: reducers.authReducer,
  AUDGENPROCESOS: reducers.AUDGENPROCESOReducer,
  ListaUsuarios: reducers.ListadoUsuariosReducer,
  ProcesoCambios: reducers.ProcesoCambiosReducer
}
