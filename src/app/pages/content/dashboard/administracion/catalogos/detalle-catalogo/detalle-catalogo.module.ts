import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetalleCatalogoRoutingModule } from './detalle-catalogo-routing.module';
import { DetalleCatalogoComponent } from './detalle-catalogo.component';


@NgModule({
  declarations: [
    DetalleCatalogoComponent
  ],
  imports: [
    CommonModule,
    DetalleCatalogoRoutingModule
  ]
})
export class DetalleCatalogoModule { }
