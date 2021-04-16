import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcesoComponent } from './proceso/proceso.component';
import { ProcesosComponent } from './procesos.component';

const routes: Routes = [
    { path: '', 
      component: ProcesosComponent             
    },
    {
      path: 'proceso',
      component: ProcesoComponent,
      
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcesosRoutingModule { }
