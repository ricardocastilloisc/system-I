import { LoadAUDGENPROCESOS, UnsetAUDGENPROCESO } from './../../../../../ReduxStore/actions/AUDGENPROCESO.actions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Observable } from 'rxjs';
import { AUDGENPROCESO_INERFACE } from '../../../../../model/AUDGENPROCESO.model';
import { map } from "rxjs/operators";
import { resolve } from 'node:path';

@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.css']
})
export class ProcesoComponent implements OnInit, OnDestroy {

  last;
  PROCESOS: any;


  constructor(
    private store: Store<AppState>,
    private rutaActiva: ActivatedRoute,
  ) { }

  AUDGENPROCESOS$: Observable<AUDGENPROCESO_INERFACE[]>;

  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENPROCESO());
  }


  ngOnInit(): void {



    this.AUDGENPROCESOS$ = this.store.select(
      ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
    ).pipe(map((res) => {
      return res = res.slice().sort(function (a, b) {
        return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime();
      })
    }))







    let body = {
      filter: { ID_FLUJO_PROCESO: { eq: this.rutaActiva.snapshot.params.id } }
    }

    this.store.dispatch(LoadAUDGENPROCESOS({ consult: body }));




  }



}
