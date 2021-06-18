import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { InterfasesRoutingModule } from './interfases-routing.module';
import { InterfasesComponent } from './interfases.component';


@NgModule({
  declarations: [
    InterfasesComponent
  ],
  imports: [
    CommonModule,
    InterfasesRoutingModule,
    NgxSpinnerModule
  ]
})
export class InterfasesModule { }
