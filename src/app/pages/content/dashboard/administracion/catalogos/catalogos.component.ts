import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { cargarCatalogos } from '../../../../../ReduxStore/actions/catalogos/catalogos.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css'],
})
export class CatalogosComponent implements OnInit,OnDestroy {

  catalogos$: Subscription
  constructor(private store: Store<AppState>) {}

  ngOnDestroy(): void {
    this.catalogos$.unsubscribe();
  }

  ngOnInit(): void {
    this.catalogos$ =this.store
      .select(({ catalogos }) => catalogos.catalogos)
      .subscribe((res) => {
        console.log(res);
      });

    this.store.dispatch(cargarCatalogos());
  }
}
