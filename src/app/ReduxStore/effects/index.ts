import { AUDGENPROCESOSEfffects } from './AUDGENPROCESOS.effects';
import { AUDGENESTADOPROCESOEfffects } from './AUDGENESTADOPROCESO.effects';
import { ListadoUsuariosEfffects } from './listaUsuarios.effects';
import { AUDGENEJECUCIONESPROCESOEfffects } from './AUDGENEJECUCIONESPROCESO.effects';
import { CATPROCESOSEfffects } from './CATPROCESOS.effects';
import { CATPERMISOSEfffects } from './CATPERMISOS.effects';
import { CatalogosEfffects } from './catalogos/catalogos.effects';

export const EffectsArrays: any[] = [
  AUDGENPROCESOSEfffects,
  ListadoUsuariosEfffects,
  AUDGENESTADOPROCESOEfffects,
  AUDGENEJECUCIONESPROCESOEfffects,
  CATPROCESOSEfffects,
  CatalogosEfffects,
  CATPERMISOSEfffects,
];
