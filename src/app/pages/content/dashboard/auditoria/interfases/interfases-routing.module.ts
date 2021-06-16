import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterfasesComponent } from './interfases.component';

const routes: Routes = [{ path: '', component: InterfasesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterfasesRoutingModule { }
