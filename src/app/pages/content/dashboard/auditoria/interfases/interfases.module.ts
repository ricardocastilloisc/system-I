import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterfasesRoutingModule } from './interfases-routing.module';
import { InterfasesComponent } from './interfases.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    InterfasesComponent
  ],
  imports: [
    CommonModule,
    InterfasesRoutingModule,
    NgxChartsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class InterfasesModule { }
