import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivosComponent } from './archivos.component';
import { DetalleArchivoComponent } from './detalle-archivo/detalle-archivo.component';

const routes: Routes = [

  /**dependiendo  si es la raiz voy la pantalla de archivos generales*/
  { path: '', component: ArchivosComponent },
  /*Si hay en el menu hay un detalle se redirge al archivo o visualizador */
  {
    path: ':id',component: DetalleArchivoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivosRoutingModule { }
