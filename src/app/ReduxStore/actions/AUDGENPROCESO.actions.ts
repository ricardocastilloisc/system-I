import { createAction, props } from "@ngrx/store";
import { AUDGENPROCESO_INERFACE } from '../../model/AUDGENPROCESO.model';

export const LoadAUDGENPROCESOS  = createAction('[AUDGENPROCESO] AUDGENPROCESO Load');

export const LoadAUDGENPROCESOSuccess  = createAction('[AUDGENPROCESO Succes] AUDGENPROCESO Success', props<{AUDGENPROCESOS:AUDGENPROCESO_INERFACE[]}>());


export const LoadAUDGENPROCESOError  = createAction('[AUDGENPROCESO Error] AUDGENPROCESO Errors', props<{payload: any}>());


export const UnsetAUDGENPROCESO  = createAction('[AUDGENPROCESO Unset] AUDGENPROCESO Unset');
