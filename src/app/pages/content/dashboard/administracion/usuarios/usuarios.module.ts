import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OredenascEmailusuriosPipe } from '../../../../../pipes/oredenascEmailusurios.pipe';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";
import { QuitarcomaPipe } from '../../../../../pipes/quitarcoma.pipe';



@NgModule({
  declarations: [
    UsuariosComponent,
    OredenascEmailusuriosPipe,
    QuitarcomaPipe,
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class UsuariosModule { }
