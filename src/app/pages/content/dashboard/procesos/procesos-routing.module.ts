import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcesoComponent } from './proceso/proceso.component';
import { ProcesosComponent } from './procesos.component';

const routes: Routes = [
  {
    path: '',
    component: ProcesosComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './procesos-pantalla-general/procesos-pantalla-general.module'
          ).then((m) => m.ProcesosPantallaGeneralModule),
      },
      {
        path: 'proceso/:id',component:   ProcesoComponent
      },
      { path: 'procesos',   redirectTo: '', pathMatch: 'full' }
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcesosRoutingModule {}
