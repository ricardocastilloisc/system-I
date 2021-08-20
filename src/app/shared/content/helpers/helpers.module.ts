import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpersComponent } from './helpers.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';





@NgModule({
  declarations: [HelpersComponent],

  /*las importaciones de la librerias que necestio */
  imports: [
    CommonModule,
    NgbModule,
  ],
  /* expoto las secciones o componenetes que quiero */
  exports: [HelpersComponent]
})
export class HelpersModule { }
