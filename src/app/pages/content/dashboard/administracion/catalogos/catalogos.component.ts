import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css'],
})
export class CatalogosComponent implements OnInit, OnDestroy {
  catalogos$: Subscription;

  AforesGens = [];
  AforesSubs = [];

  FondosGens = [];
  FondosSubs = [];

  GenericosGens = [];

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnDestroy(): void {
    this.catalogos$.unsubscribe();
  }

  goDetailCat = (negocioCat, nameCat) => {
    localStorage.setItem('nameCat', nameCat);
    localStorage.setItem('negocioCat', negocioCat);
    this.router.navigate(['/' + window.location.pathname + '/' + negocioCat]);
  };

  ngOnInit(): void {
    this.catalogos$ = this.store
      .select(({ catalogos }) => catalogos.catalogos)
      .subscribe((res) => {
        this.AforesGens = [];
        this.AforesSubs = [];

        this.FondosGens = [];
        this.FondosSubs = [];

        this.GenericosGens = [];

        if (res) {
          res.forEach((e) => {
            if (e.INTERFAZ === 'GEN') {
              this.GenericosGens.push(e);
            } else {

              console.log(e.NEGOCIO);

              console.log(e.NEGOCIO.split(','))
              e.NEGOCIO.split(',').forEach((elementd) => {
                if (elementd === 'AFORE') {
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
                } else {
                  console.log('')
                  let index = this.FondosSubs.findIndex(
                    (x) => x.INTERFAZ === e.INTERFAZ
                  );
                  if (index === -1) {
                    this.FondosSubs.push({
                      INTERFAZ: e.INTERFAZ,
                      SUBMENUS: [e],
                    });
                  } else {
                    this.FondosSubs[index].SUBMENUS.push(e);
                  }
                }
              });
            }
          });
        }
      });
  }
}
