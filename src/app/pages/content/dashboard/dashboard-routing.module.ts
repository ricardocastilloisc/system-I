import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../../Guards/auth.guard';
import { ERole } from '../../../validators/roles';
import { GuardRolesGuard } from '../../../Guards/guard-roles.guard';


//Se define el array de rutas para que la seccion del dashboard puede navegar en los elementos con sus nombres respectivos
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
      {
        path: 'Perfil', //El path sirve para enviar al componente o vista  en el front sobre la información del usuario
        loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule)
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
