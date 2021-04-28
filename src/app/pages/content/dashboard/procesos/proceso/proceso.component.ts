import { LoadAUDGENPROCESOS, UnsetAUDGENPROCESO } from './../../../../../ReduxStore/actions/AUDGENPROCESO.actions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';

@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.css']
})
export class ProcesoComponent implements OnInit,OnDestroy {

  constructor(private store: Store<AppState>,) { }



  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENPROCESO());
  }


  ngOnInit(): void {

    
    this.store.select(
      ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
    )

    let body =   {
      filter:{​​​​​ ID_FLUJO_PROCESO: {​​​​​ eq:"544cb86f-e173-496c-871e-acc6cbfb5daa"}​​​​​ }​​​​​
    }

        this.store.dispatch(LoadAUDGENPROCESOS({consult:body}));


   }


}
