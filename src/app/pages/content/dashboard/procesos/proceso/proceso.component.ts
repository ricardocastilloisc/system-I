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
import { LoadAUDGENESTADOPROCESOS, UnsetAUDGENESTADOPROCESO, LoadAUDGENEJECUCIONESPROCESO, UnsetAUDGENEJECUCIONPROCESO } from 'src/app/ReduxStore/actions';
import { APIService } from '../../../../../API.service';
import { UsuariosService } from '../../../../../services/usuarios.service';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.css'],
  providers: [NgbPaginationConfig]
})
export class ProcesoComponent implements OnInit, OnDestroy {

  DataUser$: Observable<Usuario>;
  last;
  PROCESOS = new Array();

  listaProcesos: any;
  totalItems: number;
  paginaActualEjecucionesProceso: number = 1;
  paginaActualProceso: number = 1;
  previousPage: number;
  showPagination: boolean;
  pageSize: number;
  mostrarEjecucionesProcesos: boolean = true;


  Administrador = ERole.Administrador;
  Ejecutor = ERole.Ejecutor;
  Soporte = ERole.Soporte;
  DataUser: any;

  constructor(
    private store: Store<AppState>,
    private rutaActiva: ActivatedRoute,
    private authService: AuthService,
    private api: APIService,
    private usuario: UsuariosService,
    private config: NgbPaginationConfig,
    ) {
      this.config.boundaryLinks = true;
    }

  AUDGENPROCESOS$: Observable<AUDGENPROCESO_INERFACE[]>;
  AUDGENEJECUCIONPROCESO$: Observable<AUDGENPROCESO_INERFACE[]>;
  AUDGENESTADOPROCESOS$: Observable<AUDGENESTADOPROCESO_INTERFACE[]>

  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENPROCESO());
    this.store.dispatch(UnsetAUDGENESTADOPROCESO());
    this.store.dispatch(UnsetAUDGENEJECUCIONPROCESO());
  }

  /*rolesValids = (roles: any[]): boolean => {
    return this.authService.rolesValids(roles);
  };*/

  ngOnInit(): void {


    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);


    this.DataUser$.subscribe(res => this.DataUser = res).unsubscribe()



    console.log(this.DataUser.attributes['custom:negocio'])
    this.AUDGENESTADOPROCESOS$ = this.store.select(
      ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
    ).pipe(map(res =>
      {
        if(res === null) return res
        else  return res.slice().sort(function(a,b)
        {return new Date(b.FECHA_ACTUALIZACION).getTime() - new Date(a.FECHA_ACTUALIZACION).getTime()}).filter((item, i, res) => {
          return res.indexOf(res.find(t => t.ID_PROCESO === item.ID_PROCESO)) === i
        }).filter(item => {
          return item.ETAPA != ""
        })


      }
    ))



    this.store.select(
      ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
    )


    this.store.select(
      ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
    )


    let body =   {
      filter:{​​​​​ INTERFAZ: {​​​​​ eq: this.rutaActiva.snapshot.params.id}​​​​​ }​​​​​,
      limit: 1000
    }



    this.store.dispatch(LoadAUDGENESTADOPROCESOS({consult:body}));

    // this.llenarTabla(this.page);

   }

   consultarDetalle(idProceso){

    this.AUDGENEJECUCIONPROCESO$ = this.store.select(
      ({ AUDGENEJECUCIONESPROCESO }) => AUDGENEJECUCIONESPROCESO.AUDGENEJECUCIONESPROCESO
    ).pipe( map (res => {
      if( res == null) return res
      else
        return res.filter((item, i, res) => {
          return res.indexOf(res.find(t => t.ID_PROCESO === item.ID_PROCESO)) === i
        })
    }))

    this.store.select(
      ({ AUDGENEJECUCIONESPROCESO }) => AUDGENEJECUCIONESPROCESO.AUDGENEJECUCIONESPROCESO
    ).pipe( map (res => {
      if( res == null) return res
      else
        return res.filter((item, i, res) => {
          return res.indexOf(res.find(t => t.ID_PROCESO === item.ID_PROCESO)) === i
        })
    })).subscribe(res => console.log(res))

    if(this.rolesValids(this.DataUser, [this.Administrador]))
    {
      console.log('entre al admin')
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
    }

    else

    {
      this.AUDGENPROCESOS$ = this.store.select(
        ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
      ).pipe(map(res =>
          {
            if(res === null) return res
            else return res.slice().sort(function(a,b)
            {return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime()})
          }

        ))
    }


    let body =   {
      filter:{​​​​​ ID_PROCESO: {​​​​​ eq: idProceso}​​​​​ }​​​​​,
      limit: 1000
    }

    this.store.dispatch(LoadAUDGENEJECUCIONESPROCESO({consult:body}));
    this.store.dispatch(LoadAUDGENPROCESOS({consult:body}));

    this.mostrarEjecucionesProcesos = false;
   }

   rolesValids = (User:Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids( User, roles);
  };

  // loadPage(page: number) {
  //   if (page !== this.previousPage) {
  //     this.previousPage = page;
  //     this.llenarTabla(this.page-1);
  //   }
  // }

  public navigateToSection(section: string) {
    
}

}
