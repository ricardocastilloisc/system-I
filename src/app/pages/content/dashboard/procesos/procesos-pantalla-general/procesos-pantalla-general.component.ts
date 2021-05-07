import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Observable, of, Subscription } from 'rxjs';
import { AUDGENPROCESO_INERFACE } from '../../../../../model/AUDGENPROCESO.model';
import { CATPROCESOS_INTERFACE } from '../../../../../model/CATPROCESOS.model';
import { APIService } from '../../../../../API.service';
import { distinct, filter, map, tap } from 'rxjs/operators';
import { AUDGENESTADOPROCESO_INTERFACE } from 'src/app/model/AUDGENESTADOPROCESO.model';
import { LoadAUDGENESTADOPROCESOS, UnsetAUDGENESTADOPROCESO, LoadCATPROCESOS, UnsetCATPROCESO } from 'src/app/ReduxStore/actions';
import { Usuario } from '../../../../../model/usuario.model';
import { ProcesosService } from '../../../../../services/procesos.service'
import {v4 as uuidv4} from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-procesos-pantalla-general',
  templateUrl: './procesos-pantalla-general.component.html',
  styleUrls: ['./procesos-pantalla-general.component.css'],
})
export class ProcesosPantallaGeneralComponent implements OnInit,OnDestroy {
  public createForm: FormGroup;

  inputFecha = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

  Loading$: Subscription;

  DataUser$: Observable<Usuario>;
  AUDGENPROCESOS$: Observable<AUDGENPROCESO_INERFACE[]>;
  CATPROCESOS$: Observable<CATPROCESOS_INTERFACE[]>
  AUDGENESTADOPROCESOS$: Observable<AUDGENESTADOPROCESO_INTERFACE[]>
  actualPage: number = 1;
  negocio: string;
  tipo: String;
  loading = true;

  PROCESOS = new Array();
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private rutaActiva: ActivatedRoute,
    private api: APIService,
    private serviciosProcesos: ProcesosService,
    private spinner: NgxSpinnerService
  ) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    this.rutaActiva.paramMap.subscribe(params => {
      this.ngOnInit();
    })
  }
  ngOnDestroy(): void {
    this.store.dispatch(UnsetCATPROCESO());
    //this.Loading$.unsubscribe();
  }

  ngOnInit(): void {
    

    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);

    this.DataUser$.subscribe(res => {this.negocio = res.attributes['custom:negocio']; console.log(res)}).unsubscribe()
    // this.AUDGENPROCESOS$ = this.store.select(
    //   ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
    // ).pipe( map (res => {
    //   if( res == null) return res
    //   else
    //     return res.filter((item, i, res) => {
    //       return res.indexOf(res.find(t => t.ID_PROCESO === item.ID_PROCESO)) === i
    //     })
    // }))

    
    this.tipo = this.rutaActiva.snapshot.params.tipo;

    //console.log( this.rutaActiva.snapshot.params.tipo)
    console.log( this.negocio)

    // this.AUDGENPROCESOS$ = this.store.select(
    //   ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
    // ).pipe( map (res => {
    //   if( res == null) return res
    //   else
    //     return res.slice().sort(function(a,b)
    //     {return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime()}).filter((item, i, res) => {
    //       return res.indexOf(res.find(t => t.INTERFAZ === item.INTERFAZ)) === i
    //     })
    // }))

    // this.api.ListAUDGENPROCESOS().then(res => console.log('respuesta',res.items))
    let body =   {
      filter:{​​​​​ TIPO: {​​​​​ eq: this.tipo.toUpperCase()}, NEGOCIO: { eq: this.negocio.toUpperCase()}  }​​​​​,
      limit: 1000
    }
    this.api.ListCATPROCESOS( { TIPO: { eq: this.tipo.toUpperCase()}, NEGOCIO: { eq: this.negocio.toUpperCase()}} )

    this.CATPROCESOS$ = this.store.select(
      ({ CATPROCESOS }) => CATPROCESOS.CATPROCESOS
    )

    // this.store.select(
    //   ({ CATPROCESOS }) => CATPROCESOS.CATPROCESOS
    // ).subscribe(res => console.log(res))
    

    // this.AUDGENESTADOPROCESOS$ = this.store.select(
    //   ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
    // ).pipe(map(res => 
    //   {
    //     if(res === null) return res
    //     else return res.slice().sort(function(a,b)
    //     {return new Date(b.FECHA_ACTUALIZACION).getTime() - new Date(a.FECHA_ACTUALIZACION).getTime()}).filter((item, i, res) => {
    //       return res.indexOf(res.find(t => t.INTERFAZ === item.INTERFAZ)) === i
    //     })
        
    //   }
    // ))
    

    this.store.dispatch(LoadCATPROCESOS({consult:body}));
    //this.store.dispatch(LoadAUDGENESTADOPROCESOS({consult:null}));
  }

  

  botonActivado = (parametocomparar: string): boolean => {
    return this.rutaActiva.snapshot.params.tipo === parametocomparar
      ? true
      : false;
      
  };
  refreshComponent() : void{
    this.router.navigate([this.router.url])
 }

  consultar(idProceso): void {
    this.router.navigate(['/' + window.location.pathname + '/proceso/' + idProceso]);
  }

  async inciarProceso(nombreProceso: string, correo: string, area: string) {

    this.spinner.show();

    var response;
    let idEjecucion  = uuidv4();
    console.log(nombreProceso,correo, area, idEjecucion)

    try{
      const response = await this.serviciosProcesos.iniciarProceso(nombreProceso, correo, area)
      console.log(response)

      if(response.codigo == 'EXITO'){
        this.spinner.hide();
        alert('Se inicio el proceso')
      } else {

        this.spinner.hide();
        alert('Error al ejecutar proceso')
       
      }
      
    } catch(e){

      alert('Error al ejecutar proceso')
      console.log(e)
    }

    setTimeout(() => {
      this.spinner.hide();
    }, 300);
    


  }


}
