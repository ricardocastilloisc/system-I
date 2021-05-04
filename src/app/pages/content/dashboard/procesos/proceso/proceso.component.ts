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
import { LoadAUDGENESTADOPROCESOS } from 'src/app/ReduxStore/actions';
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
  AUDGENESTADOPROCESOS$: Observable<AUDGENESTADOPROCESO_INTERFACE[]>

  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENPROCESO());
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
        }
      
      ))
      
    this.AUDGENESTADOPROCESOS$ = this.store.select(
      ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
    )

    // this.store.select(
    //   ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
    // ).subscribe(res => console.log(res))


    let body =   {
      filter:{​​​​​ ID_PROCESO: {​​​​​ eq: this.rutaActiva.snapshot.params.id}​​​​​ }​​​​​
    }

    let res = this.api.ListAUDGENESTADOPROCESOS(​​​​​)
    console.log(res)
    this.store.dispatch(LoadAUDGENPROCESOS({consult:body}));

    this.store.dispatch(LoadAUDGENESTADOPROCESOS({consult:body}));
   }

}
