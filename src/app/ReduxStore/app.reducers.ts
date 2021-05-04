
import { ActionReducerMap } from '@ngrx/store'
import * as reducers from './reducers'
export interface AppState {
  usuario: reducers.UserState,
  AUDGENPROCESOS: reducers.AUDGENPROCESOState,
  ListaUsuarios: reducers.ListaUsuariosState,
  ProcesoCambios: reducers.ProcesoCambiosState,
  AUDGENESTADOPROCESOS: reducers.AUDGENESTADOPROCESOtate,
  AUDGENEJECUCIONESPROCESO: reducers.AUDGENEJECUCIONESPROCESOState
}

export const appReducers:ActionReducerMap<AppState> = {
  usuario: reducers.authReducer,
  AUDGENPROCESOS: reducers.AUDGENPROCESOReducer,
  ListaUsuarios: reducers.ListadoUsuariosReducer,
  ProcesoCambios: reducers.ProcesoCambiosReducer,
  AUDGENESTADOPROCESOS: reducers.AUDGENESTADOPROCESOReducer,
  AUDGENEJECUCIONESPROCESO: reducers.AUDGENEJECUCIONESPROCESOReducer
}
