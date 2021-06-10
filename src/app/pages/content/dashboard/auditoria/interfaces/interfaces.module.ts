import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { InterfacesRoutingModule } from './interfaces-routing.module';
import { InterfacesComponent } from './interfaces.component';


@NgModule({
  declarations: [
    InterfacesComponent
  ],
  imports: [
    CommonModule,
    InterfacesRoutingModule,
    ChartsModule
  ]
})
export class InterfacesModule { }
