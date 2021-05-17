import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetalleCatalogoRoutingModule } from './detalle-catalogo-routing.module';
import { DetalleCatalogoComponent } from './detalle-catalogo.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [
    DetalleCatalogoComponent
  ],
  imports: [
    CommonModule,
    DetalleCatalogoRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
 

  ]
})
export class DetalleCatalogoModule { }
