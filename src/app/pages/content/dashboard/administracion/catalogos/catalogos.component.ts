import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CatalogosService } from '../../../../../services/catalogos.service';

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

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private catalogosSvc: CatalogosService
  ) {}

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
          this.AforesGens = [...this.GenericosGens.filter(e => e.NEGOCIO === 'AFORE')]
          this.FondosGens = [...this.GenericosGens.filter(e => e.NEGOCIO === 'FONDOS')]
          this.GenericosGens = [...this.GenericosGens.filter(e => e.NEGOCIO === 'AFORE,FONDOS')]
        }
      });
  }
}
