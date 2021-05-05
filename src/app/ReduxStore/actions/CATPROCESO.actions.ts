import { createAction, props } from "@ngrx/store";
import { CATPROCESOS_INTERFACE } from '../../model/CATPROCESOS.model';

export const LoadCATPROCESOS  = createAction('[CATPROCESO] CATPROCESO Load', props<{consult: any}>());

export const LoadCATPROCESOSuccess  = createAction('[CATPROCESO Succes] CATPROCESO Success', props<{CATPROCESOS:CATPROCESOS_INTERFACE[]}>());

export const LoadCATPROCESOError  = createAction('[CATPROCESO Error] CATPROCESO Errors', props<{payload: any}>());

export const UnsetCATPROCESO  = createAction('[CATPROCESO Unset] CATPROCESO Unset');