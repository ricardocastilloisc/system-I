import { createAction, props } from "@ngrx/store";
import { ConsultaUsuario } from "../reducers";

import { UsuarioListado } from './../../model/usuarioLitsa.model';


export const LoadListaUsuarios  = createAction('[ListaUsuarios] ListaUsuarios Load', props<{consulta: ConsultaUsuario}>());

export const LoadListaUsuariosSuccess  = createAction('[ListaUsuarios Succes] ListaUsuarios Success', props<{ListaUsuarios:UsuarioListado[]}>());


export const LoadListaUsuariosError  = createAction('[ListaUsuarios Error] ListaUsuarios Errors', props<{payload: any}>());


export const UnsetListaUsuarios  = createAction('[ListaUsuarios Unset] ListaUsuarios Unset');
