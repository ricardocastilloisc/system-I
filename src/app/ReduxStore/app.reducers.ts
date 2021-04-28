
import { ActionReducerMap } from '@ngrx/store'
import * as reducers from './reducers'
export interface AppState {
  usuario: reducers.UserState,
  AUDGENPROCESOS: reducers.AUDGENPROCESOState
}

export const appReducers:ActionReducerMap<AppState> = {
  usuario: reducers.authReducer,
  AUDGENPROCESOS: reducers.AUDGENPROCESOReducer
}
