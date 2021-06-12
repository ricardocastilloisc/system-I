import {
  caragarCatalogosError,
  caragarCatalogosSucces,
  unSetCatalogos,
} from './../../actions/catalogos/catalogos.actions';
import { CATALOGO_INTERFACE } from './../../../model/catalogos/catalogo.model';

import { createReducer, on } from '@ngrx/store';
import { cargarCatalogos } from '../../actions';
import { NOTIFICACION_INTERFACE } from '../../../model/notificacion.model';
import { notificacionSelect } from '../../actions/notificacionSelect/notificacionSelect.actions';

export interface notificacionSelectState {
  notificacionSelect: NOTIFICACION_INTERFACE;
}
export const notificacionSelectState: notificacionSelectState = {
  notificacionSelect: null,
};

const _notificacionSelectReducer = createReducer(
  notificacionSelectState,
  on(notificacionSelect, (state, { notificacionSelect }) => ({
    ...state,
    notificacionSelect: notificacionSelect,
  })),
);

export let notificacionSelectReducer = (state, action) =>
  _notificacionSelectReducer(state, action);

