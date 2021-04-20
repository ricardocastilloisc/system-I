import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditoriageneralComponent } from './auditoriageneral.component';

const routes: Routes = [{ path: '', component: AuditoriageneralComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditoriageneralRoutingModule { }
