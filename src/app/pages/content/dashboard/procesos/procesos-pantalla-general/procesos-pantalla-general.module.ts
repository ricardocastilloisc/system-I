import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcesosPantallaGeneralRoutingModule } from './procesos-pantalla-general-routing.module';
import { ProcesosPantallaGeneralComponent } from './procesos-pantalla-general.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProcesoComponent } from '../proceso/proceso.component'
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProcesosService } from './../../../../../services/procesos.service'
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    ProcesosPantallaGeneralComponent,
    ProcesoComponent
  ],
  imports: [
    NgxPaginationModule,
    CommonModule,
    ProcesosPantallaGeneralRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    OrderModule,
    NgxSpinnerModule,
  ],
  providers: [ProcesosService]
})
export class ProcesosPantallaGeneralModule { }
