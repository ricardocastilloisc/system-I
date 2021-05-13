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
export class CatalogosComponent implements OnInit, OnDestroy {
  catalogos$: Subscription;

  AforesGens = [];
  AforesSubs = [];
  constructor(private store: Store<AppState>) {}

  ngOnDestroy(): void {
    this.catalogos$.unsubscribe();
  }

  ngOnInit(): void {
    this.catalogos$ = this.store
      .select(({ catalogos }) => catalogos.catalogos)
      .subscribe((res) => {
        this.AforesGens = [];
        this.AforesSubs = [];
        res.forEach((e) => {
          if (e.INTERFAZ === 'GEN') {
            this.AforesGens.push(e);
          } else {
            let index = this.AforesSubs.findIndex(
              (x) => x.INTERFAZ === e.INTERFAZ
            );
            if (index === -1) {
              this.AforesSubs.push({
                INTERFAZ: e.INTERFAZ,
                SUBMENUS: [e],
              });
            } else {
              this.AforesSubs[index].SUBMENUS.push(e);
            }
          }
        });
      });
    this.store.dispatch(cargarCatalogos());
  }
}
