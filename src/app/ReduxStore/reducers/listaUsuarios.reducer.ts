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
  loading: boolean;
}
export const ListaUsuariosState: ListaUsuariosState = {
  ListaUsuarios: [],
  consulta: null,
  error: null,
  loading: false,
};

const _ListadoUsuariosReducer = createReducer(
  ListaUsuariosState,
  on(LoadListaUsuarios, (state, { consulta }) => ({
    ...state,
    loading: true,
    consulta: consulta,
  })),
  on(LoadListaUsuariosSuccess, (state, { ListaUsuarios }) => ({
    ...state,
    ListaUsuarios: [...ListaUsuarios],
    loading: false,
    error: null,
  })),
  on(UnsetListaUsuarios, (state) => ({
    ...state,
    ListaUsuarios: null,
    loading: false,
    consulta: null,
    error: null,
  })),

  on(LoadListaUsuariosError, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  }))
);

export let ListadoUsuariosReducer = (state, action) =>
  _ListadoUsuariosReducer(state, action);
