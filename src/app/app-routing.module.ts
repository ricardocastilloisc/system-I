import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ProcesosComponent } from './pages/content/dashboard/procesos/procesos.component';

const routes: Routes = [
  { path: '', component:LoginComponent},
  { path: 'dashboard', loadChildren: () => import('./pages/content/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'procesos', component:ProcesosComponent},
  { path: '**', redirectTo: '' },
];


// ng generate module dashboard --route dashboard --module app.module


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
