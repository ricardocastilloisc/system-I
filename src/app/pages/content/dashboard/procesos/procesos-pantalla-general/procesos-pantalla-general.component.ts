import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
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
import { distinct, filter, first, map, tap } from 'rxjs/operators';
import { AUDGENESTADOPROCESO_INTERFACE } from 'src/app/model/AUDGENESTADOPROCESO.model';
import { CATPERMISOS_INTERFACE } from 'src/app/model/CATPERMISOS.model'
import { LoadCATPROCESOS, UnsetCATPROCESO, LoadCATPERMISOS, UnsetCATPERMISO, LoadAUDGENESTADOPROCESOS } from 'src/app/ReduxStore/actions';
import { Usuario } from '../../../../../model/usuario.model';
import { ProcesosService } from '../../../../../services/procesos.service'
import {v4 as uuidv4} from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
import { EArea, ERole } from './../../../../../validators/roles';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-procesos-pantalla-general',
  templateUrl: './procesos-pantalla-general.component.html',
  styleUrls: ['./procesos-pantalla-general.component.css'],
})

export class ProcesosPantallaGeneralComponent implements OnInit,OnDestroy {


  @ViewChild('modalEstado') templateRef: TemplateRef<any>;
  
  Areas = [
    EArea.Contabilidad,
    EArea.Custodia,
    EArea.Inversiones_Riesgos,
    EArea.Tesoreria,
    EArea.Soporte
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
  CATESTADOS: AUDGENESTADOPROCESO_INTERFACE[];

  PROCESOS$: Observable<any>;

  procesoEjecutar: string;
  mensajeEjecucion: string;
  actualPage: number = 1;
  negocios = [];
  area: string;
  tipo: String;
  loading = true;

  Administrador = ERole.Administrador;
  Ejecutor = ERole.Monitor;

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
    private modalService: NgbModal,
    private datePipe: DatePipe
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

    //console.log("Negocios", this.DataUser.attributes["custom:negocio"].split(','))
    this.tipo = this.rutaActiva.snapshot.params.tipo;

    this.negocios = this.DataUser.attributes["custom:negocio"].split(',')
 
    this.negocios = this.negocios.map(negocio => {return negocio.toUpperCase()})


    let bodyProcesos =   {
      filter:{​​​​​ TIPO: {​​​​​ eq: this.tipo.toUpperCase()}}​​​​​,
      limit: 1000
    }

    let bodyPermisos = {
      NEGOCIOS: this.negocios, AREA: this.area, ROL: this.DataUser.attributes["custom:rol"].toUpperCase()
    }


    this.CATPERMISOS$ = this.store.select(
      ({ CATPERMISOS }) => CATPERMISOS.CATPERMISOS
    )

    // this.store.select(
    //   ({ CATPERMISOS }) => CATPERMISOS.CATPERMISOS
    // ).subscribe(res => this.CATPERMISOS = res)


    this.api.ListCATPERMISOS(this.negocios ,this.area, this.DataUser.attributes["custom:rol"].toUpperCase()).then(res => console.log('resultado',res))
    this.store.dispatch(LoadCATPROCESOS({consult:bodyProcesos}));
    


    // this.store.select(
    //   ({ CATPROCESOS }) => CATPROCESOS.CATPROCESOS
    // ).subscribe( res => this.CATPROCESOS = res)

    this.CATPROCESOS$ = this.store.select(
      ({ CATPROCESOS }) => CATPROCESOS.CATPROCESOS
    )


    this.store.dispatch(LoadCATPERMISOS({consult:bodyPermisos}));
    
  }

  obtenerProcesos(catProcesos: Array<CATPROCESOS_INTERFACE>, catPermisos: Array<CATPERMISOS_INTERFACE>){

    let tempArray = new Array()
     //console.log(catProcesos)
     //console.log(catPermisos)

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

  openModal(content, nombreProceso){
    this.procesoEjecutar = nombreProceso;
    
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  modalMensaje(content, mensajeEjecucion){

    this.mensajeEjecucion = mensajeEjecucion;


    
    

    this.modalService.open(this.templateRef, { ariaLabelledBy: 'modal-basic-title' });

  }


  async inciarProceso( correo: string, area: string) {

    console.log(this.procesoEjecutar)
    let CATESTADOS;
    let todayDate = new Date()
    
    console.log(this.datePipe.transform(todayDate, "dd-MM-yyyy"))

    this.spinner.show();

    let body = {
      filter:{​​​​​ INTERFAZ: { eq: this.procesoEjecutar}, FECHA_ACTUALIZACION: { contains: this.datePipe.transform(todayDate,"yyyy-MM-dd") } }​​​​​,
      limit: 10000000
    }

    
    await this.api.ListAUDGENESTADOPROCESOS(body.filter, body.limit).then(res => {

      this.CATESTADOS = res.items.slice().sort(function (a, b) { return new Date(b.FECHA_ACTUALIZACION).getTime() - new Date(a.FECHA_ACTUALIZACION).getTime() })     

    })

    

    //console.log('que hay aqui ', this.CATESTADOS)



    if(this.CATESTADOS[0]?.ESTADO === 'FALLIDO'  || this.CATESTADOS[0]?.ESTADO === 'EXITOSO'  || this.CATESTADOS === [] ){

      let idEjecucion  = uuidv4();
      console.log(this.procesoEjecutar,correo, area, idEjecucion)

      try{
        const response = await this.serviciosProcesos.iniciarProceso(this.procesoEjecutar, correo, area)
        //console.log(response)

        if(response.codigo == 'EXITO'){
          this.spinner.hide();
          this.modalMensaje("modalEstado","Se inicio el proceso")

        } else {

          this.spinner.hide();
          this.modalMensaje("modalEstado","Error al ejecutar proceso")
        
        }
        
      } catch(e){

        this.modalMensaje("modalEstado","Error al ejecutar proceso")
        console.log(e)
      }

    }else ( 
      this.modalMensaje("modalEstado","El proceso se encuentra en ejecución")
    
    )
      

    setTimeout(() => {
      this.spinner.hide();
    }, 300);
    

    
  }

  rolesValids = (User: Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids(User, roles);
  };


  cerrarModales = () =>{
    this.modalService.dismissAll();
  }

}
