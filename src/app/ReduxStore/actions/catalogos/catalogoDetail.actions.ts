import { CATALOGO_INTERFACE } from './../../../model/catalogos/catalogo.model';
import { createAction, props } from "@ngrx/store";


export const loadingDetailCatalogos = createAction('[DetailCatalogos] Loading DetailCatalogos');

export const loadingCompleteDetailCatalogos = createAction('[DetailCatalogos] Loading CompleteDetailCatalogos');

export const cargarDetailCatalogos = createAction('[DetailCatalogos] Cargar DetailCatalogos');

export const caragarDetailCatalogosSucces = createAction(
  '[DetailCatalogos] Cargar DetailCatalogos Success',
  props<{DetailCatalogos: any}>()
)

export const caragarDetailCatalogosError = createAction(
  '[DetailCatalogos] Cargar DetailCatalogos Error',
  props<{payload: any}>()
)

export const unSetDetailCatalogos = createAction('[DetailCatalogos] unSetDetailCatalogos');
