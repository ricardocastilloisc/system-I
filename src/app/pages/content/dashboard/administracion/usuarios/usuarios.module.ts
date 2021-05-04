import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OredenascEmailusuriosPipe } from '../../../../../pipes/oredenascEmailusurios.pipe';


@NgModule({
  declarations: [
    UsuariosComponent,
    OredenascEmailusuriosPipe
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ReactiveFormsModule
  ]
})
export class UsuariosModule { }
