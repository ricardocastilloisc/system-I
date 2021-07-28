import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivosComponent } from './archivos.component';
import { DetalleArchivoComponent } from './detalle-archivo/detalle-archivo.component';

const routes: Routes = [
  { path: '', component: ArchivosComponent },
  {
    path: ':id',component: DetalleArchivoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivosRoutingModule { }
