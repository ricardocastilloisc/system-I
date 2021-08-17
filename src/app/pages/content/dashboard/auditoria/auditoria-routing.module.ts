import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditoriaComponent } from './auditoria.component';

const routes: Routes = [
  {
    path: '',
    component: AuditoriaComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./auditoriageneral/auditoriageneral.module').then(
            (m) => m.AuditoriageneralModule
          ),
      },
      {
        path: 'interfaces',
        loadChildren: () =>
          import('./interfases/interfases.module').then((m) => m.InterfasesModule),
      },
      {
        path: 'catalogos',
        loadChildren: () =>
          import('./catalogos/catalogos.module').then((m) => m.CatalogosModule),
      },
      {
        path: 'procesos',
        loadChildren: () =>
          import('./procesos/procesos.module').then((m) => m.ProcesosModule),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./usuarios/usuarios.module').then((m) => m.UsuariosModule),
      },
      {
        path: 'archivos',
        loadChildren: () =>
          import('./archivos/archivos.module').then((m) => m.ArchivosModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditoriaRoutingModule {}
