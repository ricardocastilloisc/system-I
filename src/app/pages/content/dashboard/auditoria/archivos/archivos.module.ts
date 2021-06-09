import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchivosRoutingModule } from './archivos-routing.module';
import { ArchivosComponent } from './archivos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  declarations: [
    ArchivosComponent
  ],
  imports: [
    CommonModule,
    ArchivosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class ArchivosModule { }
