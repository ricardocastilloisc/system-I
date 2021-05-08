import { createAction, props } from "@ngrx/store";
import { CATPERMISOS_INTERFACE } from '../../model/CATPERMISOS.model';

export const LoadCATPERMISOS  = createAction('[CATPERMISO] CATPERMISO Load', props<{consult: any}>());

export const LoadCATPERMISOSuccess  = createAction('[CATPERMISO Succes] CATPERMISO Success', props<{CATPERMISOS:CATPERMISOS_INTERFACE[]}>());


export const LoadCATPERMISOError  = createAction('[CATPERMISO Error] CATPERMISO Errors', props<{payload: any}>());


export const UnsetCATPERMISO  = createAction('[CATPERMISO Unset] CATPERMISO Unset');
