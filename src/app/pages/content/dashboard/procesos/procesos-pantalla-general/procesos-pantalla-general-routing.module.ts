import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcesosPantallaGeneralComponent } from './procesos-pantalla-general.component';


const routes: Routes = [
  { path: '', component: ProcesosPantallaGeneralComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcesosPantallaGeneralRoutingModule { }
