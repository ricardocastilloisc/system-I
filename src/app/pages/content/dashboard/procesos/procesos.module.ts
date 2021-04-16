import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcesosRoutingModule } from './procesos-routing.module';
import { ProcesosComponent } from './procesos.component';
import { ProcesoComponent } from './proceso/proceso.component';


@NgModule({
  declarations: [
    ProcesosComponent,
    ProcesoComponent
  ],
  imports: [
    CommonModule,
    ProcesosRoutingModule
  ]
})
export class ProcesosModule { }
