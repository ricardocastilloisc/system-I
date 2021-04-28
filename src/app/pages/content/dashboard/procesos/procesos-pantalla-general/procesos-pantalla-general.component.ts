import { LoadAUDGENPROCESOS, UnsetAUDGENPROCESO } from './../../../../../ReduxStore/actions/AUDGENPROCESO.actions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class ProcesosPantallaGeneralComponent implements OnInit,OnDestroy {
  public createForm: FormGroup;

  inputFecha = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

  AUDGENPROCESOS$: Observable<AUDGENPROCESO_INERFACE[]>;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private rutaActiva: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENPROCESO());
  }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      ID: ['', Validators.required],
      FECHA_FERIADO: ['', Validators.required],
    });

    this.AUDGENPROCESOS$ = this.store.select(
      ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
    )





let body =   {
  filter:{​​​​​ ID_FLUJO_PROCESO: {​​​​​ eq:"544cb86f-e173-496c-871e-acc6cbfb5daa"}​​​​​ }​​​​​
}

    this.store.dispatch(LoadAUDGENPROCESOS({consult:body}));
  }

  botonActivado = (parametocomparar: string): boolean => {
    return this.rutaActiva.snapshot.params.tipo === parametocomparar
      ? true
      : false;
  };

  consultar() {
    this.router.navigate(['/' + window.location.pathname + '/proceso']);
  }
}
