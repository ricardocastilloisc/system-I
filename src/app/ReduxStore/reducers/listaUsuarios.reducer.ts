import {
  LoadListaUsuarios,
  LoadListaUsuariosError,
  LoadListaUsuariosSuccess,
} from './../actions/listaUsuarios.actions';
import { createReducer, on } from '@ngrx/store';
import { UnsetListaUsuarios } from '../actions/listaUsuarios.actions';
import { UsuarioListado } from '../../model/usuarioLitsa.model';

export interface ConsultaUsuario {
  parametro: string;
  tipo: string;
}
export interface ListaUsuariosState {
  ListaUsuarios: UsuarioListado[];
  consulta: ConsultaUsuario;
  error: any;
}
export const ListaUsuariosState: ListaUsuariosState = {
  ListaUsuarios: [],
  consulta: null,
  error: null,
};

const _ListadoUsuariosReducer = createReducer(
  ListaUsuariosState,
  on(LoadListaUsuarios, (state, { consulta }) => ({
    ...state,
    consulta: consulta,
  })),
  on(LoadListaUsuariosSuccess, (state, { ListaUsuarios }) => ({
    ...state,
    ListaUsuarios: [...ListaUsuarios],
    error: null,
  })),
  on(UnsetListaUsuarios, (state) => ({
    ...state,
    ListaUsuarios: null,
    consulta: null,
    error: null,
  })),

  on(LoadListaUsuariosError, (state, { payload }) => ({
    ...state,
    error: payload,
  }))
);

export let ListadoUsuariosReducer = (state, action) =>
  _ListadoUsuariosReducer(state, action);
