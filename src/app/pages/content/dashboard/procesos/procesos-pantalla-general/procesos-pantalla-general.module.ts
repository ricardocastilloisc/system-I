import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcesosPantallaGeneralRoutingModule } from './procesos-pantalla-general-routing.module';
import { ProcesosPantallaGeneralComponent } from './procesos-pantalla-general.component';


@NgModule({
  declarations: [
    ProcesosPantallaGeneralComponent
  ],
  imports: [
    CommonModule,
    ProcesosPantallaGeneralRoutingModule
  ]
})
export class ProcesosPantallaGeneralModule { }
