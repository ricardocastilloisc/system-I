import { LoadAUDGENPROCESOS, UnsetAUDGENPROCESO } from './../../../../../ReduxStore/actions/AUDGENPROCESO.actions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Observable } from 'rxjs';
import { AUDGENPROCESO_INERFACE } from '../../../../../model/AUDGENPROCESO.model';

@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.css']
})
export class ProcesoComponent implements OnInit,OnDestroy {

  constructor(
    private store: Store<AppState>,
    private rutaActiva: ActivatedRoute) { }

  AUDGENPROCESOS$: Observable<AUDGENPROCESO_INERFACE[]>;

  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENPROCESO());
  }


  ngOnInit(): void {

    
    this.AUDGENPROCESOS$ = this.store.select(
      ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
    )

    

    let body =   {
      filter:{​​​​​ ID_FLUJO_PROCESO: {​​​​​ eq:"544cb86f-e173-496c-871e-acc6cbfb5daa"}​​​​​ }​​​​​
    }

    this.store.dispatch(LoadAUDGENPROCESOS({consult:body}));


    // let lenght = this.AUDGENPROCESOS$.subscribe(res => {return res.length})
    // console.log("here", lenght);
        
   }


}
