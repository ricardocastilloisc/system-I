import { createReducer, on } from '@ngrx/store';
import { Usuario } from 'src/app/model/usuario.model';


import { setUser, unSetUser } from '../actions/usuario.actions';

export interface UserState {
  user: Usuario;
}

export const initialState: UserState = {
  user: null,
};

const _authReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({ ...state, user: { ...user } })),
  on(unSetUser, (state) => ({ ...state, user: null }))
);

export let authReducer = (state, action) => {
  return _authReducer(state, action);
};
