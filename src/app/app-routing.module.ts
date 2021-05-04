import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './Guards/auth.guard';
import { GuestGuard } from './Guards/guest.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  {
    path: '',
    loadChildren: () =>
      import('./pages/content/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
   canLoad: [AuthGuard],
  },
  { path: '**', redirectTo: 'login' },
];

// ng generate module dashboard --route dashboard --module app.module

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
