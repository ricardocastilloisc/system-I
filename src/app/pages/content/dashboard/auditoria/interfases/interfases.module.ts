import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { InterfasesRoutingModule } from './interfases-routing.module';
import { InterfasesComponent } from './interfases.component';


@NgModule({
  declarations: [
    InterfasesComponent
  ],
  imports: [
    CommonModule,
    InterfasesRoutingModule,
    ChartsModule
  ]
})
export class InterfasesModule { }
