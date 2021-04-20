import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcesosRoutingModule } from './procesos-routing.module';
import { ProcesosComponent } from './procesos.component';


@NgModule({
  declarations: [
    ProcesosComponent
  ],
  imports: [
    CommonModule,
    ProcesosRoutingModule
  ]
})
export class ProcesosModule { }
