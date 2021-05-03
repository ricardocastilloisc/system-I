import { createAction, props } from "@ngrx/store";
import { AUDGENESTADOPROCESO_INTERFACE } from '../../model/AUDGENESTADOPROCESO.model';

export const LoadAUDGENESTADOPROCESOS = createAction('[AUDGENESTADOPROCESO] AUDGENESTADOPROCESO Load', props<{consult: any}>());

export const LoadAUDGENESTADOPROCESOSuccess  = createAction('[AUDGENESTADOPROCESO Succes] AUDGENESTADOPROCESO Success', props<{AUDGENESTADOPROCESOS:AUDGENESTADOPROCESO_INTERFACE[]}>());


export const LoadAUDGENESTADOPROCESOError  = createAction('[AUDGENESTADOPROCESO Error] AUDGENESTADOPROCESO Errors', props<{payload: any}>());


export const UnsetAUDGENESTADOPROCESO  = createAction('[AUDGENESTADOPROCESO Unset] AUDGENESTADOPROCESO Unset');
