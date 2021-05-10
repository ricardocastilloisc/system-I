import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../../Guards/auth.guard';
import { ERole } from '../../../validators/roles';
import { GuardRolesGuard } from '../../../Guards/guard-roles.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'procesos/:tipo',
        loadChildren: () =>
          import('./procesos/procesos.module').then((m) => m.ProcesosModule),
      canActivate: [GuardRolesGuard],
        data: {
          roles: [ERole.Administrador, ERole.Monitor],
        }, ///aqui se ponen los roles autorizados
      },
      {
        path: 'administracion',
        loadChildren: () =>
          import('./administracion/administracion.module').then(
            (m) => m.AdministracionModule
          ),
        canActivate: [GuardRolesGuard],
        data: { roles: [ERole.Administrador, ERole.Monitor] },
      },
      {
        path: 'auditoria',
        loadChildren: () => import('./auditoria/auditoria.module').then(m => m.AuditoriaModule)
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
