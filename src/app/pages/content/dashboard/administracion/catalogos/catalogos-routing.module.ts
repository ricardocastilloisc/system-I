import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogosComponent } from './catalogos.component';

const routes: Routes = [
  { path: '', component: CatalogosComponent },
  { path: ':nombreCatalogo', loadChildren: () => import('./detalle-catalogo/detalle-catalogo.module').then(m => m.DetalleCatalogoModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogosRoutingModule { }
