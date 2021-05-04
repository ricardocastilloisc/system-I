import { LoadAUDGENPROCESOS, UnsetAUDGENPROCESO } from './../../../../../ReduxStore/actions/AUDGENPROCESO.actions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Observable } from 'rxjs';
import { AUDGENPROCESO_INERFACE } from '../../../../../model/AUDGENPROCESO.model';
import { AUDGENESTADOPROCESO_INTERFACE } from '../../../../../model/AUDGENESTADOPROCESO.model';
import { map } from "rxjs/operators";
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../../../../../model/usuario.model';
import { ERole } from '../../../../../validators/roles';
import { LoadAUDGENESTADOPROCESOS, UnsetAUDGENESTADOPROCESO } from 'src/app/ReduxStore/actions';
import { APIService } from '../../../../../API.service' 

@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.css']
})
export class ProcesoComponent implements OnInit, OnDestroy {

  DataUser$: Observable<Usuario>;
  last;
  PROCESOS = new Array();


  Administrador = ERole.Administrador;
  Ejecutor = ERole.Ejecutor;
  Soporte = ERole.Soporte;

  constructor(
    private store: Store<AppState>,
    private rutaActiva: ActivatedRoute,
    private authService: AuthService,
    private api: APIService
    ) { }

  AUDGENPROCESOS$: Observable<AUDGENPROCESO_INERFACE[]>;
  AUDGENPROCESOSINTERFAZ$: Observable<AUDGENPROCESO_INERFACE[]>;
  AUDGENESTADOPROCESOS$: Observable<AUDGENESTADOPROCESO_INTERFACE[]>

  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENPROCESO());
    this.store.dispatch(UnsetAUDGENESTADOPROCESO());
  }

  /*rolesValids = (roles: any[]): boolean => {
    return this.authService.rolesValids(roles);
  };*/

  ngOnInit(): void {
    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);

    
    this.AUDGENPROCESOS$ = this.store.select(
      ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
    ).pipe(map(res => 
        {
          if(res === null) return res
          else return res.slice().sort(function(a,b)
          {return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime()})
          .filter(item => {
            return item.MENSAJE_NEGOCIO != ""
          })
        }
      
      ))
      
    

    this.AUDGENESTADOPROCESOS$ = this.store.select(
      ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
    ).pipe(map(res => 
      {
        if(res === null) return res
        else return res.slice().sort(function(a,b)
        {return new Date(b.FECHA_ACTUALIZACION).getTime() - new Date(a.FECHA_ACTUALIZACION).getTime()})
        
      }
    
    ))

    this.store.select(
      ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
    )


    this.store.select(
      ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
    )


    let body =   {
      filter:{​​​​​ ID_PROCESO: {​​​​​ eq: this.rutaActiva.snapshot.params.id}​​​​​ }​​​​​,
      limit: 1000
    }

    //console.log('id Proceso: ', this.rutaActiva.snapshot.params.id)

    // this.api.ListAUDGENESTADOPROCESOS({ ID_PROCESO: {​​​​​ eq: this.rutaActiva.snapshot.params.id}​​​​}, 1000 ).then(res => {console.log(res)})
    
    // let rs1 = this.api.ListAUDGENPROCESOS({​​​​​ ID_PROCESO: {​​​​​ eq: this.rutaActiva.snapshot.params.id}​​​​​ }, 1000).then(res => console.log('Consulta directa proceos:', res))
    // console.log(res)
    this.store.dispatch(LoadAUDGENPROCESOS({consult:body}));

    this.store.dispatch(LoadAUDGENESTADOPROCESOS({consult:body}));
   }

   consultaDetalle(idProceso){
    this.AUDGENPROCESOSINTERFAZ$ = this.store.select(
      ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
    ).pipe( map (res => {
      if( res == null) return res
      else
        return res.filter((item, i, res) => {
          return res.indexOf(res.find(t => t.ID_PROCESO === item.ID_PROCESO)) === i
        })
    }))

    let body =   {
      filter:{​​​​​ ID_PROCESO: {​​​​​ eq: idProceso}​​​​​ }​​​​​,
      limit: 1000
    }
    
   }
}
