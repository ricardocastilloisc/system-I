import { CATALOGO_INTERFACE } from './../../../model/catalogos/catalogo.model';
import { createAction, props } from "@ngrx/store";


export const cargarCatalogos = createAction('[Catalogos] Cargar Catalogos');

export const caragarCatalogosSucces = createAction(
  '[Catalogos] Cargar Catalogos Success',
  props<{catalogos: CATALOGO_INTERFACE[]}>()
)

export const caragarCatalogosError = createAction(
  '[Catalogos] Cargar Catalogos Error',
  props<{payload: any}>()
)

export const unSetCatalogos = createAction('[Catalogos] unSetCatalogos');

