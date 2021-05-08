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
import { AuthService } from 'src/app/services/auth.service';
import { distinct, filter, map, tap } from 'rxjs/operators';
import { AUDGENESTADOPROCESO_INTERFACE } from 'src/app/model/AUDGENESTADOPROCESO.model';
import { CATPERMISOS_INTERFACE } from 'src/app/model/CATPERMISOS.model'
import { LoadCATPROCESOS, UnsetCATPROCESO, LoadCATPERMISOS, UnsetCATPERMISO } from 'src/app/ReduxStore/actions';
import { Usuario } from '../../../../../model/usuario.model';
import { ProcesosService } from '../../../../../services/procesos.service'
import {v4 as uuidv4} from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
import { EArea, ERole } from './../../../../../validators/roles';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'app-procesos-pantalla-general',
  templateUrl: './procesos-pantalla-general.component.html',
  styleUrls: ['./procesos-pantalla-general.component.css'],
})
export class ProcesosPantallaGeneralComponent implements OnInit,OnDestroy {

  Areas = [
    EArea.Contabilidad,
    EArea.Custodia,
    EArea.InversionesRiesgos,
    EArea.Tesoreria,
  ];


  public createForm: FormGroup;

  inputFecha = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

  Loading$: Subscription;

  DataUser$: Observable<Usuario>;
  AUDGENPROCESOS$: Observable<AUDGENPROCESO_INERFACE[]>;
  CATPROCESOS$: Observable<CATPROCESOS_INTERFACE[]>
  AUDGENESTADOPROCESOS$: Observable<AUDGENESTADOPROCESO_INTERFACE[]>;
  CATPERMISOS$: Observable<CATPERMISOS_INTERFACE[]>;

  CATPROCESOS: CATPROCESOS_INTERFACE[];
  CATPERMISOS: CATPERMISOS_INTERFACE[];

  PROCESOS$: Observable<any>;

  actualPage: number = 1;
  negocio: string;
  area: string;
  tipo: String;
  loading = true;

  Administrador = ERole.Administrador;
  Ejecutor = ERole.Ejecutor;
  Soporte = ERole.Soporte;

  DataUser:  Usuario;
  PROCESOS = new Array();
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private rutaActiva: ActivatedRoute,
    private api: APIService,
    private serviciosProcesos: ProcesosService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private usuario: UsuariosService,
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
  }

  ngOnInit(): void {

    
    this.actualPage = 1;
    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);


    this.store.select(({ usuario }) => usuario.user).subscribe(res => {this.DataUser = res});
    
    this.area = this.obtenerArea();

    this.tipo = this.rutaActiva.snapshot.params.tipo;

 
    let bodyProcesos =   {
      filter:{​​​​​ TIPO: {​​​​​ eq: this.tipo.toUpperCase()}}​​​​​,
      limit: 1000
    }

    let bodyPermisos = {
      filter:{​​​​​ AREA: {​​​​​ eq: this.area}, ROL: { eq: this.DataUser.attributes["custom:rol"].toUpperCase() }}​​​​​,
      limit: 1000
    }


    this.CATPERMISOS$ = this.store.select(
      ({ CATPERMISOS }) => CATPERMISOS.CATPERMISOS
    )

    this.store.select(
      ({ CATPERMISOS }) => CATPERMISOS.CATPERMISOS
    ).subscribe(res => this.CATPERMISOS = res)
    
    // this.store.select(
    //   ({ CATPERMISOS }) => CATPERMISOS.CATPERMISOS
    // ).subscribe(res => console.log(res))

    this.api.ListCATPERMISOS({​​​​​ AREA: {​​​​​ eq: this.area}, ROL: { eq: this.DataUser.attributes["custom:rol"].toUpperCase() }}).then(res => console.log(res))
    this.store.dispatch(LoadCATPROCESOS({consult:bodyProcesos}));
    
    //this.store.dispatch(LoadAUDGENESTADOPROCESOS({consult:null}));

    this.store.select(
      ({ CATPROCESOS }) => CATPROCESOS.CATPROCESOS
    ).subscribe( res => this.CATPROCESOS = res)

    this.CATPROCESOS$ = this.store.select(
      ({ CATPROCESOS }) => CATPROCESOS.CATPROCESOS
    )


    this.store.dispatch(LoadCATPERMISOS({consult:bodyPermisos}));
    
    //console.log(this.area)

  }

  obtenerProcesos(catProcesos: Array<CATPROCESOS_INTERFACE>, catPermisos: Array<CATPERMISOS_INTERFACE>){

    let tempArray = new Array()
    // console.log(catProcesos)
    // console.log(catPermisos)

    catProcesos.forEach(proceso => {

      catPermisos.forEach( permiso => {
        if(permiso.FLUJO == proceso.PROCESO)
        
        tempArray.push({"DESCRIPCION": proceso.DESCRIPCION, 
                        "PROCESO": proceso.PROCESO, 
                        "DETENER": permiso.PROCESOS.DETENER, 
                        "INICIAR": permiso.PROCESOS.INICIAR, 
                        "MONITOREAR": permiso.PROCESOS.MONITOREAR })
      }

      )

    }

    )
    //console.log('tempArray', tempArray)

    this.PROCESOS = tempArray;

    return true
  }

  validarBoton(Proceso){
    let negocio = this.DataUser.attributes["custom:negocio"].toUpperCase().trim()
    
    let area = this.obtenerArea()
    
    //console.log(area)

    if( area === Proceso.ARRANQUE){
      return true

    }else return false

  }

  
  obtenerArea(): string{
    let arrayTempArea = [];

    this.DataUser.groups.forEach((area) => {
        
        this.Areas.forEach(areaDef =>
          {
            if(area === areaDef){
              arrayTempArea.push(area);
            }            
          })

    })
    if(arrayTempArea.length > 0)
      return arrayTempArea[0].toUpperCase()
    else "N/D"


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

  rolesValids = (User: Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids(User, roles);
  };



}
