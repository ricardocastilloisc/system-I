import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcesosRoutingModule } from './procesos-routing.module';
import { ProcesosComponent } from './procesos.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    ProcesosComponent
  ],
  imports: [
    CommonModule,
    ProcesosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ProcesosModule { }
