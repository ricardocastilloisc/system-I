import { NOTIFICACION_INTERFACE } from './../../model/notificacion.model';
import { createReducer, on } from '@ngrx/store';
import { crearnotificacione, setnotificaciones } from '../actions/notificaciones.actions';


export interface NotificacionesState{
  notificaciones: NOTIFICACION_INTERFACE[];
}



export const estadoInicial: NotificacionesState = {
  notificaciones: []
}


const _NotificacionesReducer = createReducer(
  estadoInicial,
  on(crearnotificacione, (state, { notificacion }) => ({ ...state, notificaciones: [...state.notificaciones, notificacion ] })),
  on(setnotificaciones, (state, { notificaciones }) => ({ ...state, notificaciones: notificaciones})),

);

export let NotificacionesReducer = (state, action) => {
  return _NotificacionesReducer(state, action);
};
