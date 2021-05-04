import { createReducer, on } from '@ngrx/store';
import { Usuario } from 'src/app/model/usuario.model';

import { setUser, unSetUser, setUserRol, setUserArea } from '../actions/usuario.actions';

export interface UserState {
  user: Usuario;
  rol: String;
  area: String;
}

export const initialState: UserState = {
  user: null,
  rol: null,
  area: null,
};

const _authReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({ ...state, user: { ...user }, rol: null, area: null})),
  on(setUserRol, (state, { rol }) => ({ ...state, rol:rol, area: null})),
  on(setUserArea, (state, { area }) => ({ ...state, rol:null, area: area})),
  on(unSetUser, (state) => ({ ...state, user: null }))
);

export let authReducer = (state, action) => {
  return _authReducer(state, action);
};
