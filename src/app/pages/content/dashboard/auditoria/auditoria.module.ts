import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditoriaRoutingModule } from './auditoria-routing.module';
import { AuditoriaComponent } from './auditoria.component';

@NgModule({
  declarations: [
    AuditoriaComponent
  ],
  imports: [
    CommonModule,
    AuditoriaRoutingModule
  ]
})
export class AuditoriaModule { }
