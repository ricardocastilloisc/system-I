import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcesosPantallaGeneralRoutingModule } from './procesos-pantalla-general-routing.module';
import { ProcesosPantallaGeneralComponent } from './procesos-pantalla-general.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcesoComponent } from '../proceso/proceso.component'
import { OrderModule } from 'ngx-order-pipe';


@NgModule({
  declarations: [
    ProcesosPantallaGeneralComponent,
    ProcesoComponent
  ],
  imports: [
    CommonModule,
    ProcesosPantallaGeneralRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    OrderModule,
  ]
})
export class ProcesosPantallaGeneralModule { }
