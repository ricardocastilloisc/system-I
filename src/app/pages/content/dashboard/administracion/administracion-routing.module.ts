import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministracionComponent } from './administracion.component';
import { GuardRolesGuard } from '../../../../Guards/guard-roles.guard';
import { ERole } from '../../../../validators/roles';

const routes: Routes = [
  {
    path: '',
    component: AdministracionComponent,
    children: [
      {
        path: 'catalogos',
        loadChildren: () =>
          import('./catalogos/catalogos.module').then((m) => m.CatalogosModule),
          canActivate: [GuardRolesGuard],
          data: { roles: [ERole.Administrador, ERole.Monitor] },
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
        canActivate: [GuardRolesGuard],
        data: { roles: [ERole.Administrador] },
      },
      {
        path: 'notificaciones',
        loadChildren: () => import('./notificaciones/notificaciones.module').then(m => m.NotificacionesModule),
        canActivate: [GuardRolesGuard],
        data: { roles: [ERole.Administrador] },
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracionRoutingModule {}
