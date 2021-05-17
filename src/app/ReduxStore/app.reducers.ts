
import { ActionReducerMap } from '@ngrx/store'
import * as reducers from './reducers'
export interface AppState {
  usuario: reducers.UserState,
  AUDGENPROCESOS: reducers.AUDGENPROCESOState,
  ListaUsuarios: reducers.ListaUsuariosState,
  ProcesoCambios: reducers.ProcesoCambiosState,
  AUDGENESTADOPROCESOS: reducers.AUDGENESTADOPROCESOtate,
  AUDGENEJECUCIONESPROCESO: reducers.AUDGENEJECUCIONESPROCESOState,
  CATPROCESOS: reducers.CATPROCESOState,
  CATPERMISOS: reducers.CATPERMISOState,
  notificaciones: reducers.NotificacionesState,
  catalogos: reducers.CatalogosState,
  DetailCatalogos: reducers.DetailCatalogosState
}

export const appReducers:ActionReducerMap<AppState> = {
  usuario: reducers.authReducer,
  AUDGENPROCESOS: reducers.AUDGENPROCESOReducer,
  ListaUsuarios: reducers.ListadoUsuariosReducer,
  ProcesoCambios: reducers.ProcesoCambiosReducer,
  AUDGENESTADOPROCESOS: reducers.AUDGENESTADOPROCESOReducer,
  AUDGENEJECUCIONESPROCESO: reducers.AUDGENEJECUCIONESPROCESOReducer,
  CATPROCESOS: reducers.CATPROCESOReducer,
  CATPERMISOS: reducers.CATPERMISOReducer,
  notificaciones: reducers.NotificacionesReducer,
  catalogos: reducers.catalogosReducer,
  DetailCatalogos: reducers.DetailCatologosReducer
}
