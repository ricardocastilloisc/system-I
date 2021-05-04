import { createAction, props } from '@ngrx/store';
import { Usuario } from '../../model/usuario.model';

export const setUser = createAction(
  '[Auth] setUser',
  props<{ user:  Usuario }>()
);

export const setUserRol = createAction(
  '[Auth] setUserRol',
  props<{ rol:  String }>()
);

export const setUserArea = createAction(
  '[Auth] setUserArea',
  props<{ area:  String }>()
);

export const unSetUser = createAction('[Auth] unSetUser');
