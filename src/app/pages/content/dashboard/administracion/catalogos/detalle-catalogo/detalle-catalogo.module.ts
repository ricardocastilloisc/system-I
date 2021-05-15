import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetalleCatalogoRoutingModule } from './detalle-catalogo-routing.module';
import { DetalleCatalogoComponent } from './detalle-catalogo.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    DetalleCatalogoComponent
  ],
  imports: [
    CommonModule,
    DetalleCatalogoRoutingModule,
    NgxPaginationModule,
  ]
})
export class DetalleCatalogoModule { }
