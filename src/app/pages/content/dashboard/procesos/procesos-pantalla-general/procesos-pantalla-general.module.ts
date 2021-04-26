import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcesosPantallaGeneralRoutingModule } from './procesos-pantalla-general-routing.module';
import { ProcesosPantallaGeneralComponent } from './procesos-pantalla-general.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProcesosPantallaGeneralComponent
  ],
  imports: [
    CommonModule,
    ProcesosPantallaGeneralRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class ProcesosPantallaGeneralModule { }
