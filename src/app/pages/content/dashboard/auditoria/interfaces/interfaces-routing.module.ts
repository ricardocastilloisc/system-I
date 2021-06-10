import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterfacesComponent } from './interfaces.component';

const routes: Routes = [{ path: '', component: InterfacesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterfacesRoutingModule { }
