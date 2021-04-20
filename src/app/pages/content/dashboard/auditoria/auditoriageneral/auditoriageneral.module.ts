import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditoriageneralRoutingModule } from './auditoriageneral-routing.module';
import { AuditoriageneralComponent } from './auditoriageneral.component';


@NgModule({
  declarations: [
    AuditoriageneralComponent
  ],
  imports: [
    CommonModule,
    AuditoriageneralRoutingModule
  ]
})
export class AuditoriageneralModule { }
