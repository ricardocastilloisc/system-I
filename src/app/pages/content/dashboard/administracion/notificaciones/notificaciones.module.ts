import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificacionesRoutingModule} from './notificaciones-routing.module'
import { NotificacionesComponent } from './notificaciones.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    NotificacionesComponent
  ],
  imports: [
    CommonModule,
    NotificacionesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxSpinnerModule 
  ]
})
export class NotificacionesModule { }
