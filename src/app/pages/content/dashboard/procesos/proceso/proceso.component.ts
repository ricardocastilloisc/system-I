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
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.css']
})
export class ProcesoComponent implements OnInit, OnDestroy {

  filtroEjecucionesForm: FormGroup;

  DataUser$: Observable<Usuario>;
  last;
  PROCESOS = new Array();

  listaProcesos: any;
  totalItems: number;
  paginaActualEjecucionesProceso: number = 1;
  paginaActualProceso: number = 1;
  mostrarEjecucionesProcesos: boolean = true;
  maxDate: Date;
  Administrador = ERole.Administrador;
  Ejecutor = ERole.Ejecutor;
  Soporte = ERole.Soporte;
  DataUser: any;
  ejemplo
  fechaBusqueda: Date;

  constructor(
    private store: Store<AppState>,
    private rutaActiva: ActivatedRoute,
    private authService: AuthService,
    private api: APIService,
    private usuario: UsuariosService,
    private fb: FormBuilder,
  ) { }

  AUDGENPROCESOS$: Observable<AUDGENPROCESO_INERFACE[]>;
  AUDGENEJECUCIONPROCESO$: Observable<AUDGENPROCESO_INERFACE[]>;
  AUDGENESTADOPROCESOS$: Observable<AUDGENESTADOPROCESO_INTERFACE[]>

  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENPROCESO());
    this.store.dispatch(UnsetAUDGENESTADOPROCESO());
    this.store.dispatch(UnsetAUDGENEJECUCIONPROCESO());
  }

  ngOnInit(): void {
    this.filtroEjecucionesForm = this.fb.group({
      fechaFiltrar: ['Fecha']
    })

    this.api.OnUpdateAUDGENESTADOPROCESOListener().subscribe(res => console.log(res))

    this.maxDate = new Date();
    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);


    this.DataUser$.subscribe(res => this.DataUser = res).unsubscribe()



    console.log(this.DataUser.attributes['custom:negocio'])
    this.AUDGENESTADOPROCESOS$ = this.store.select(
      ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
    ).pipe(map(res => {
      if (res === null) return res
      else return res.slice().sort(function (a, b) { return new Date(b.FECHA_ACTUALIZACION).getTime() - new Date(a.FECHA_ACTUALIZACION).getTime() }).filter((item, i, res) => {
        return res.indexOf(res.find(t => t.ID_PROCESO === item.ID_PROCESO)) === i
      }).filter(item => {
        return item.ETAPA != ""
      })


    }
    ))

    // this.store.select(
    //   ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
    // ).subscribe(res => console.log('que hay',res))



    this.store.select(
      ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
    )


    this.store.select(
      ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
    )


    let body = {
      filter: { INTERFAZ: { eq: this.rutaActiva.snapshot.params.id } },
      limit: 1000
    }



    this.store.dispatch(LoadAUDGENESTADOPROCESOS({ consult: body }));

    // this.llenarTabla(this.page);

  }

  consultarDetalle(idProceso) {

    this.AUDGENEJECUCIONPROCESO$ = this.store.select(
      ({ AUDGENEJECUCIONESPROCESO }) => AUDGENEJECUCIONESPROCESO.AUDGENEJECUCIONESPROCESO
    ).pipe(map(res => {
      if (res == null) return res
      else
        return res.filter((item, i, res) => {
          return res.indexOf(res.find(t => t.ID_PROCESO === item.ID_PROCESO)) === i
        })
    }))

    this.store.select(
      ({ AUDGENEJECUCIONESPROCESO }) => AUDGENEJECUCIONESPROCESO.AUDGENEJECUCIONESPROCESO
    ).pipe(map(res => {
      if (res == null) return res
      else
        return res.filter((item, i, res) => {
          return res.indexOf(res.find(t => t.ID_PROCESO === item.ID_PROCESO)) === i
        })
    })).subscribe(res => console.log(res))


    this.store.select(
      ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
    ).pipe(map(res => {
      if (res === null) return res
      else return res.slice().sort(function (a, b) { return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime() })
    }

    )).subscribe(res => console.log(res))

    if (this.rolesValids(this.DataUser, [this.Administrador])) {
      console.log('entre al admin')
      this.AUDGENPROCESOS$ = this.store.select(
        ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
      ).pipe(map(res => {
        if (res === null) return res
        else return res.slice().sort(function (a, b) { return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime() })
          .filter(item => {
            return item.MENSAJE_NEGOCIO != ""
          })
      }

      ))
    }

    else {
      this.AUDGENPROCESOS$ = this.store.select(
        ({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS
      ).pipe(map(res => {
        if (res === null) return res
        else return res.slice().sort(function (a, b) { return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime() })
      }

      ))
    }


    let body = {
      filter: { ID_PROCESO: { eq: idProceso } },
      limit: 1000
    }

    this.store.dispatch(LoadAUDGENEJECUCIONESPROCESO({ consult: body }));
    this.store.dispatch(LoadAUDGENPROCESOS({ consult: body }));

    this.mostrarEjecucionesProcesos = false;
  }

  rolesValids = (User: Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids(User, roles);
  };



  busquedaFiltros() {
    if (this.filtroEjecucionesForm.valid) {
      let fechaFiltro = this.filtroEjecucionesForm.get('fechaFiltrar').value;
      console.log(this.filtroEjecucionesForm.get('fechaFiltrar').value)
      this.AUDGENESTADOPROCESOS$ = this.store.select(
        ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
      ).pipe(map(res => {
        if (res === null) return res
        else return res.slice().sort(function (a, b) { return new Date(b.FECHA_ACTUALIZACION).getTime() - new Date(a.FECHA_ACTUALIZACION).getTime() }).filter((item, i, res) => {
          return res.indexOf(res.find(t => t.ID_PROCESO === item.ID_PROCESO)) === i
        }).filter(item => {
          return item.ETAPA != ""
        })
      }
      ))
      this.store.select(
        ({ AUDGENEJECUCIONESPROCESO }) => AUDGENEJECUCIONESPROCESO.AUDGENEJECUCIONESPROCESO
      ).pipe(map(res => {
        if (res == null) return res
        else
          return res.filter((item, i, res) => {
            return res.indexOf(res.find(t => t.ID_PROCESO === item.ID_PROCESO)) === i
          })
      })).subscribe(res => console.log(res))

      let body = {
        filter: { FECHA_ACTUALIZACION: { contains: fechaFiltro }, INTERFAZ: { eq: this.rutaActiva.snapshot.params.id } },
        limit: 1000
      }

      this.store.dispatch(LoadAUDGENESTADOPROCESOS({ consult: body }));
    }
  }


  obtenerNotificaciones(fechaInicioSesion) {
    if (fechaInicioSesion) {
      let body = {
        filter: { FECHA_ACTUALIZACION: { gt: fechaInicioSesion } },
        limit: 1000
      }
      this.store.dispatch(LoadAUDGENESTADOPROCESOS({ consult: body }));
    }
  }
/* EJEMPLO RESPONSE */

/*
{
  "data": {
    "listAUDGENESTADOPROCESOS": {
      "nextToken": "eyJ2ZXJzaW9uIjoyLCJ0b2tlbiI6IkFRSUNBSGg5OUIvN3BjWU41eE96NDZJMW5GeGM4WUNGeG1acmFOMUpqajZLWkFDQ25BRS9DQWQxbExNTW9rTzlPRytIR2dNYUFBQUNGVENDQWhFR0NTcUdTSWIzRFFFSEJxQ0NBZ0l3Z2dIK0FnRUFNSUlCOXdZSktvWklodmNOQVFjQk1CNEdDV0NHU0FGbEF3UUJMakFSQkF6ZlU5UVVQanlEclFEZ1doNENBUkNBZ2dISWtZWWRSQ21ZL0p5c3RIYkdTSFM4MnNrZTZmOGk3cUlQUWR6aUI5ZWxVME5GL1BVUm4xNHNHYjFtY1hVN2R5Yy95YkxpSlMrWE8zeEkzVVVHNUt1bnM2U1FGcXhXdHJQb2xnNEh1bjRBc09ucE9DWkRrczEvYzk5Zm1ZMFUyaWVRanhna0tOaTlSc0ZFeGVlc1pERTBFdW5VWTFMaWZwT0hMY25wZTVVMXBBZXFmRWFnRHZGdmdQdmhDRi9ybWhkN0RpWE11Mzk5NndNS25rM2FUbkJab3pob2RnMHRHWFo1bXFqS1pkb1oxN3NaU1YvVWhMRElCSE1Ub2tnSDdkMElyY0t3Ly85QW1OanEraGRWNmlFdkk0RDJmd3FPaVZZWVB4UU94cUc5N2JpRmQzaVQwd29tM1pGZUQyVkZOb1ZSb3JsVjhaeEFVa3BQKy95emY0UDZGVmFrVzg5N2FYMy85N0craWdiM21nbnBLb1Q2MC9FNE5FNk93Y0p1STY2TkRVRkRKTVlHQ0RHMUxaZHZnakJXcFVKT0RIa0VOTXN3K2phdnUyNFkrYlhMNkdPNm1oN2NhVXJRRURCR0paWlVVMkdOQy9scEdNNXFDZDdSMjlwNHVhbExreVpmelAwTFEvQWtBTnRKalZWQ25YSGVrbjVDRDA2ZktNcnJzZmtGTzZYLzcrK2JEQ1hoNGJBd2FHbEgrN2tIZ0UxV050SDBwVFptU2ZaL09DdkQxSFNWeUJJY1JaU1RFeFNRaytPQUJTWGNjc1l4U1h6bmRiRlp6UkJHdEl3c0tKMENMcU5rIn0=",
      "items": [
        {
          "ESTADO": "TERMINADO",            --> MAPEO
          "ESTADO_EJECUCION": "EJECUCION",  --> MAPEO
          "ETAPA": "INICIAL",
          "TIPO_PROCESO": "INTRADIA (INT)",
          "INTERFAZ": "AIMS Y EXCEDENTES",  --> MAPEO 
          "INSUMO": "API TRADES",
          "ID_PROCESO": "eb1cbf63-9df9-47b4-97fa-8ca41856a1dd",
          "FECHA_CREADO": "2021-05-06T18:18:21.692317-05:00",
          "FECHA_ACTUALIZACION": "2021-05-06T18:18:22.097675-05:00"
        },
        {
          "ESTADO": "INICIADO",
          "ESTADO_EJECUCION": "EJECUCION",
          "ETAPA": "INICIAL",
          "TIPO_PROCESO": "INTRADIA (INT)",
          "INTERFAZ": "AIMS Y EXCEDENTES",
          "INSUMO": "API TRADES",
          "ID_PROCESO": "2a386895-7fc3-4a77-ab1c-e615f0ad4a3b",
          "FECHA_CREADO": "2021-05-06T11:32:40.568221-05:00",
          "FECHA_ACTUALIZACION": "2021-05-06T11:32:41.842442-05:00"
        },
        {
          "ESTADO": "TERMINADO",
          "ESTADO_EJECUCION": "EJECUCION",
          "ETAPA": "INICIAL",
          "TIPO_PROCESO": "INTRADIA (INT)",
          "INTERFAZ": "AIMS Y EXCEDENTES",
          "INSUMO": "API TRADES",
          "ID_PROCESO": "004a588e-9347-4f0d-b768-537c90d577ab",
          "FECHA_CREADO": "2021-05-06T15:36:52.026210-05:00",
          "FECHA_ACTUALIZACION": "2021-05-06T15:36:53.711150-05:00"
        }
      ]
    }
  }
}
 */ 

}
