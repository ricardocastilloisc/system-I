import { createAction, props } from "@ngrx/store";
import { AUDGENPROCESO_INERFACE } from '../../model/AUDGENPROCESO.model';

export const LoadAUDGENEJECUCIONESPROCESO  = createAction('[AUDGENEJECUCIONPROCESO] AUDGENEJECUCIONPROCESO Load', props<{consult: any}>());

export const LoadAUDGENEJECUCIONPROCESOSuccess  = createAction('[AUDGENEJECUCIONPROCESO Succes] AUDGENEJECUCIONPROCESO Success', props<{AUDGENEJECUCIONESPROCESO:AUDGENPROCESO_INERFACE[]}>());


export const LoadAUDGENEJECUCIONPROCESOError  = createAction('[AUDGENEJECUCIONPROCESO Error] AUDGENEJECUCIONPROCESO Errors', props<{payload: any}>());


export const UnsetAUDGENEJECUCIONPROCESO  = createAction('[AUDGENEJECUCIONPROCESO Unset] AUDGENEJECUCIONPROCESO Unset');
