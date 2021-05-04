import { LoadAUDGENPROCESOS, UnsetAUDGENPROCESO } from './../../../../../ReduxStore/actions/AUDGENPROCESO.actions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Observable, of } from 'rxjs';
import { AUDGENPROCESO_INERFACE } from '../../../../../model/AUDGENPROCESO.model';
import { APIService } from '../../../../../API.service';
import { distinct, filter, map, tap } from 'rxjs/operators';
import { AUDGENESTADOPROCESO_INTERFACE } from 'src/app/model/AUDGENESTADOPROCESO.model';
import { LoadAUDGENESTADOPROCESOS } from 'src/app/ReduxStore/actions';

@Component({
  selector: 'app-procesos-pantalla-general',
  templateUrl: './procesos-pantalla-general.component.html',
  styleUrls: ['./procesos-pantalla-general.component.css'],
})
export class ProcesosPantallaGeneralComponent implements OnInit,OnDestroy {
  public createForm: FormGroup;

  inputFecha = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

  AUDGENPROCESOS$: Observable<AUDGENPROCESO_INERFACE[]>;
  AUDGENESTADOPROCESOS$: Observable<AUDGENESTADOPROCESO_INTERFACE[]>

  PROCESOS = new Array();
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private rutaActiva: ActivatedRoute,
    private api: APIService
  ) {}
  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENPROCESO());
  }

  ngOnInit(): void {


    this.AUDGENPROCESOS$ = this.store.select(
      ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
    ).pipe( map (res => {
      if( res == null) return res
      else
        return res.filter((item, i, res) => {
          return res.indexOf(res.find(t => t.ID_PROCESO === item.ID_PROCESO)) === i
        })
    }))

    this.api.ListAUDGENPROCESOS().then(res => console.log('respuesta',res.items))




    this.AUDGENESTADOPROCESOS$ = this.store.select(
      ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
    ).pipe(map(res => 
      {
        if(res === null) return res
        else return res.slice().sort(function(a,b)
        {return new Date(b.FECHA_ACTUALIZACION).getTime() - new Date(a.FECHA_ACTUALIZACION).getTime()})
        
      }
    
    ))

    this.store.dispatch(LoadAUDGENPROCESOS({consult:null}));
    this.store.dispatch(LoadAUDGENESTADOPROCESOS({consult:null}));
  }

  botonActivado = (parametocomparar: string): boolean => {
    return this.rutaActiva.snapshot.params.tipo === parametocomparar
      ? true
      : false;
  };

  consultar(idProceso) {
    this.router.navigate(['/' + window.location.pathname + '/proceso/' + idProceso]);
  }

}
