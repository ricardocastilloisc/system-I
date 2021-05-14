import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleCatalogoComponent } from './detalle-catalogo.component';

const routes: Routes = [{ path: '', component: DetalleCatalogoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetalleCatalogoRoutingModule { }
