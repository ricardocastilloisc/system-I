import { OrdenarNotificacionesFechaPipe } from './../../../pipes/ordenar-notificaciones-fecha.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from '../../../shared/content/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    OrdenarNotificacionesFechaPipe
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
