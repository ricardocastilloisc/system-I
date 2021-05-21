import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetalleCatalogoRoutingModule } from './detalle-catalogo-routing.module';
import { DetalleCatalogoComponent } from './detalle-catalogo.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrdenasPkPipe } from '../../../../../../pipes/ordenas-pk.pipe';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';



@NgModule({
  declarations: [
    DetalleCatalogoComponent,
    OrdenasPkPipe
  ],
  imports: [
    CommonModule,
    DetalleCatalogoRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class DetalleCatalogoModule { }
