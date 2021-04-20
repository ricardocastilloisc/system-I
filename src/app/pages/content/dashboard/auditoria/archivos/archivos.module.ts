import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchivosRoutingModule } from './archivos-routing.module';
import { ArchivosComponent } from './archivos.component';


@NgModule({
  declarations: [
    ArchivosComponent
  ],
  imports: [
    CommonModule,
    ArchivosRoutingModule
  ]
})
export class ArchivosModule { }
