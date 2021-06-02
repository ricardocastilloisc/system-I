import { createAction, props } from "@ngrx/store";
import { AUDGENUSUARIO_INTERFACE } from '../../../model/AUDGENUSUARIO.model';

export const LoadAUDGENUSUARIOS  = createAction('[AUDGENUSUARIO] AUDGENUSUARIO Load', props<{consult: any}>());

export const LoadAUDGENUSUARIOSuccess  = createAction('[AUDGENUSUARIO Succes] AUDGENUSUARIO Success', props<{AUDGENUSUARIOS:AUDGENUSUARIO_INTERFACE[]}>());


export const LoadAUDGENUSUARIOError  = createAction('[AUDGENUSUARIO Error] AUDGENUSUARIO Errors', props<{payload: any}>());


export const UnsetAUDGENUSUARIO  = createAction('[AUDGENUSUARIO Unset] AUDGENUSUARIO Unset');
