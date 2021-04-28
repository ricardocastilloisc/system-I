import { LoadAUDGENPROCESOS } from './../../../../../ReduxStore/actions/AUDGENPROCESO.actions';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService, CreateAUDGENPROCESOSInput, ListAUDGENPROCESOSQuery } from '../../../../../API.service';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { formatDate } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Observable } from 'rxjs';
import { AUDGENPROCESO_INERFACE } from '../../../../../model/AUDGENPROCESO.model';


@Component({
  selector: 'app-procesos-pantalla-general',
  templateUrl: './procesos-pantalla-general.component.html',
  styleUrls: ['./procesos-pantalla-general.component.css'],
})
export class ProcesosPantallaGeneralComponent implements OnInit {

  public createForm: FormGroup;

  inputFecha = formatDate(new Date(),'yyyy-MM-dd', 'en-US');


  AUDGENPROCESOS$:Observable<AUDGENPROCESO_INERFACE[]>

  constructor(private router: Router, private store: Store<AppState>, private fb: FormBuilder, private rutaActiva: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.createForm = this.fb.group({
      'ID': ['', Validators.required],
      'FECHA_FERIADO': ['', Validators.required]
    });

    this.AUDGENPROCESOS$ = this.store.select(({AUDGENPROCESOS})=>AUDGENPROCESOS.AUDGENPROCESOS);

    this.store.dispatch(LoadAUDGENPROCESOS());
  }

  botonActivado = (parametocomparar:string):boolean => {
    return this.rutaActiva.snapshot.params.tipo===parametocomparar?true:false;
  }

  consultar(){
    this.router.navigate(['/'+window.location.pathname+'/proceso']);
  }
}
