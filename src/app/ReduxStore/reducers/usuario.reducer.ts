import { createReducer, on } from '@ngrx/store';
import { Usuario } from 'src/app/model/usuario.model';


import { setUser, unSetUser, setUserArea } from '../actions/usuario.actions';

export interface UserState {
  user: Usuario;
  area: String;
}

export const initialState: UserState = {
  user: null,
  area: null,
};

const _authReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({ ...state, user: { ...user }, area: null})),
  on(setUserArea, (state, { area }) => ({ ...state, area: area})),
  on(unSetUser, (state) => ({ ...state, user: null }))
);

export let authReducer = (state, action) => {
  return _authReducer(state, action);
};
