import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfasesService } from 'src/app/services/interfases.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as d3 from 'd3';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EArea } from './../../../../../validators/roles';
import { EMeses } from './../../../../../validators/meses';
import { Observable, of, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { CATPROCESOS_INTERFACE } from '../../../../../model/CATPROCESOS.model';
import { LoadCATPROCESOS, UnsetCATPROCESO } from 'src/app/ReduxStore/actions';
import { LogeoService } from '../../../../../services/logeo.service';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
declare var $: any;

@Component({
  selector: 'app-interfases',
  templateUrl: './interfases.component.html',
  styleUrls: ['./interfases.component.css']
})

export class InterfasesComponent implements OnInit, OnDestroy {
  @ViewChild('modalEstado') templateRef: TemplateRef<any>;
  @ViewChild('modalReporte') templateReporte: TemplateRef<any>;
  // declaracion de variables usadas para los filtros de las consultas
  maxDate: Date = new Date();
  filtroForm: FormGroup;
  dropdownListFiltroTipo = [];
  SettingsFiltroDeTipo: IDropdownSettings = {};
  selectedItemsFiltroTipo = [];
  dropdownListFiltroNegocio: any = [];
  SettingsFiltroDeNegocio: IDropdownSettings = {};
  selectedItemsFiltroNegocio = [];
  dropdownListFiltroProceso = [];
  SettingsFiltroDeProceso: IDropdownSettings = {};
  selectedItemsFiltroProceso = [];
  dropdownListFiltroMes = [];
  SettingsFiltroDeMes: IDropdownSettings = {};
  selectedItemsFiltroMes = [];
  dropdownListFiltroTipoReporte = [];
  SettingsFiltroDeTipoReporte: IDropdownSettings = {};
  selectedItemsFiltroTipoReporte = [];
  // declaracion de la consulta de procesos activos
  CATPROCESOS$: Observable<CATPROCESOS_INTERFACE[]>;
  CATPROCESOS: CATPROCESOS_INTERFACE[];
  // declaracion de variables globales usadas para los graficos
  dataOriginal: any = [];
  listadoProblemas: any = [];
  datosDiurno: false;
  datosNocturno: false;
  treeMapNotEmpty = false;
  single: any[];
  datosDiurnoAfore: any[];
  datosDiurnoFondos: any[];
  datosNocturnoAfore: any[];
  datosNocturnoFondos: any[];
  datosDetalleDiurno: any[];
  datosDetalleNocturno: any[];
  datosAforeFondos: any[];
  datosLanzamiento: any[];
  datosAforeFondosNocturno: any[];
  datosLanzamientoNocturno: any[];
  detalleDiurno = false;
  detalleNocturno = false;
  flagDatos: boolean;
  flagMinimizarDiurno = false;
  flagMinimizarNocturno = false;
  flagSoporte = false;
  // declaracion de variables globales usadas para la manipulacion de la pantalla
  paginaActual = 1;
  dias = 30;
  expresionDias = 'de los últimos 30 días';
  expresion = '';
  initTipo = 'DIURNO';
  mensajeError: string;
  helpTitulo = '';
  helpBody = '';
  // declaracion de las variables usadas para la generacion de reportes
  tipo = '';
  anioReporte = 1900;
  mesReporte = '';
  dataReporteMensual: any;
  dataGraficaMensual: any;
  docDefinitionMensual: any;
  dataReporteAnual: any;
  dataGraficaAnual: any;
  docDefinitionanual: any;
  item = {
    name: 'Ejecuciones'
  };
  // decalracion de variables para la configuracion y textos de los graficos
  explodeSlices = false;
  gradient = false;
  showLegend = true;
  showLabels = true;
  showDataLabel = true;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  legendPosition = 'below';
  legendTitle = 'Datos';
  xAxisLabel = 'Número de ejecuciones';
  xAxisLabelProcesos = 'Procesos';
  yAxisLabel = 'Tipo';
  yAxisLabelNegocio = 'Negocio';
  animations = true;
  treemap: any;
  treemapPath: any[] = [];
  sumBy = 'Size';
  drilldownAddress = null;
  tituloGrafico = '';
  tituloGraficoNocturno = '';
  colorScheme = {
    domain: ['#5AA454', '#A10A28']
  };
  setLabelFormatting(name: any): string {
    const self: any = this;
    const data = self.series.filter(x => x.name === name);
    if (data.length > 0) {
      return `${data[0].value}`;
    } else {
      return name;
    }
  }
  // declaracion de variables para los graficos de los reportes
  view: any[] = [450, 300];
  flagVisibilidadMensual = false;
  flagVisibilidadAnual = false;
  xAxisLabelTiempo = 'Meses';
  timeline = true;

  constructor(
    private spinner: NgxSpinnerService,
    private interfasesService: InterfasesService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>,
    private logeo: LogeoService) {
  }

  /* inicializacion de datos */
  initData = () => {
    try {
      this.datosAforeFondos = [];
      this.datosLanzamiento = [];
      this.datosDiurnoAfore = [];
      this.datosDiurnoFondos = [];
      this.datosNocturnoAfore = [];
      this.datosNocturnoFondos = [];
      this.datosDetalleDiurno = [];
      this.datosDetalleNocturno = [];
      this.dataOriginal = [];
      this.listadoProblemas = [];
      localStorage.setItem('tipoPantalla', 'INTERFACES');
    } catch (err) {
      this.logeo.registrarLog('AUDITORIA INTERFACES', 'INICIALIZAR DATOS', JSON.stringify(err));
    }
  }

  /* inicializacion de datos para los select del filtrado */
  initSelects = () => {
    // por tipo
    this.dropdownListFiltroTipo = [
      { item_id: 'DIURNO', item_text: 'DIURNOS' },
      { item_id: 'NOCTURNO', item_text: 'NOCTURNOS' },
    ];
    // por negocio
    this.dropdownListFiltroNegocio = [
      { item_id: 'AFORE', item_text: 'AFORE' },
      { item_id: 'FONDOS', item_text: 'FONDOS' },
    ];
    // por proceso
    this.store.select(
      ({ CATPROCESOS }) => CATPROCESOS.CATPROCESOS
    ).subscribe(res => {
      this.CATPROCESOS = res;
      // tslint:disable-next-line: forin
      for (let i in res) {
        const item = {
          item_id: res[i].PROCESO,
          item_text: res[i].PROCESO,
        };
        this.dropdownListFiltroProceso.push(item);
      }
    });
    // meses para los reportes
    for (let i in EMeses) {
      const item = {
        item_id: EMeses[i].id,
        item_text: EMeses[i].descripcion,
      };
      this.dropdownListFiltroMes.push(item);
    }
    // tipo de reporte
    this.dropdownListFiltroTipoReporte = [
      { item_id: 'ANUAL', item_text: 'Anual' },
      { item_id: 'MENSUAL', item_text: 'Mensual' },
    ];
    // configuracion visual de los selects
    this.SettingsFiltroDeNegocio = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      clearSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
    };
    this.SettingsFiltroDeTipo = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      clearSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
    };
    this.SettingsFiltroDeProceso = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      clearSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
    };
    this.SettingsFiltroDeMes = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      clearSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
    };
    this.SettingsFiltroDeTipoReporte = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      clearSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
    };
    this.filtroForm = this.fb.group({
      filtroFechaInicio: [],
      filtroFechaFin: []
    });
  }

  /* inicializacion para los procesos */
  initProcesos(tipo: string): void {
    const bodyProcesos = {
      filter: { TIPO: { eq: tipo.toUpperCase() } },
      limit: 1000
    };
    this.store.dispatch(LoadCATPROCESOS({ consult: bodyProcesos }));
  }

  /* limpieza de los campos para aplicar filtros */
  limpiarFiltro(pantalla: string): void {
    if (pantalla.length < 1) {
      pantalla = localStorage.getItem('tipoPantalla');
    }
    this.selectedItemsFiltroTipo = [];
    this.selectedItemsFiltroNegocio = [];
    this.selectedItemsFiltroProceso = [];
    this.limpiarFiltroReporte();
    this.filtroForm.reset();
    if (pantalla.includes('INTERFACES')) {
      this.initDatosInterfaces();
    } else if (pantalla.includes('PROBLEMAS')) {
      this.initDatosProblemas();
    }
  }

  // limpiar campos seleccionados para la generacion del reporte
  limpiarFiltroReporte() {
    this.selectedItemsFiltroTipoReporte = [];
    this.selectedItemsFiltroMes = [];
    this.docDefinitionMensual = [];
    // banderas de visibilidad para la generacion de los reportes
    // solamente visibles para activar la descarga
    this.flagVisibilidadMensual = false;
    this.flagVisibilidadAnual = false;
  }

  /* asignar pantalla principal (interfaces o problemas identificados) */
  setPantalla(pantalla: string): void {
    localStorage.setItem('tipoPantalla', pantalla);
    this.limpiarFiltro(pantalla);
  }

  /* activar boton de la pantalla principal (interfaces o problemas) */
  botonActivado = (pantalla: string): boolean => {
    return localStorage.getItem('tipoPantalla') === pantalla
      ? true
      : false;
  }

  /* asignar el titiulo y las descripciones de las ayudas en la pantalla */
  helperQuestions = (origen: any) => {
    if (origen === 'DEL') {
      this.helpTitulo = 'Fecha desde';
      this.helpBody = 'Fecha desde la cual se filtrará la información.';
    } else if (origen === 'AL') {
      this.helpTitulo = 'Fecha hasta';
      this.helpBody = 'Fecha hasta la cual se filtrará la información.';
    } else if (origen === 'RESUMEN') {
      this.helpTitulo = 'Resumen';
      this.helpBody = 'En esta sección encontraras el número de ejecuciones de los procesos por negocio, proceso, tipo de lanzamiento y estado de la ejecución. Dando clic sobre cada sección se tendrá más detalle.';
    } else if (origen === 'DIURNOS') {
      this.helpTitulo = 'Diurno';
      this.helpBody = 'En esta sección encontraras el detalle de las ejecuciones de los procesos Diurnos.';
    } else if (origen === 'NOCTURNOS') {
      this.helpTitulo = 'Nocturno';
      this.helpBody = 'En esta sección encontraras el detalle de las ejecuciones de los procesos Nocturnos';
    } else if (origen === 'DETALLE') {
      this.helpTitulo = 'Detalle';
      this.helpBody = 'En esta sección encontraras las ejecuciones exitosas y fallidas. Dando clic sobre cada sección se tendrá más detalle.';
    } else if (origen === 'REPORTE') {
      this.helpTitulo = 'Reporte';
      this.helpBody = 'Generación de un reporte con por meses del año y mes seleccionado. Este reporte se genera en un archivo PDF descargable.';
    }
  }

  // abrir el modal generico de advertencia
  openModal(): void {
    this.modalService.open(this.templateRef, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  // abrir modal para la genracion del reporte, se solicita mes y tipo del reporte a generar
  abrirGenerarReporte(): void {
    this.modalService.open(this.templateReporte, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  /* cerrar todos los modales de la pantalla */
  cerrarModales = () => {
    this.limpiarFiltroReporte();
    this.modalService.dismissAll();
  }

  /* validar el rol del usuario */
  validarRolMensaje(): boolean {
    let flag = false;
    if (localStorage.getItem('area').includes(EArea.Soporte)) {
      flag = true;
    }
    return flag;
  }

  /* cambiar el estilo del elemento seleccionado en los filtros */
  cambiarEtiquetaSeleccionadaGeneral(elemento: any): void {
    setTimeout(() => {
      $('#' + elemento)
        .find('.selected-item')
        .attr('class', 'etiquetasCatalogos');
    }, 1);
  }

  /* funcion para iniciar componentes al entrar a la pantalla */
  ngOnInit(): void {
    try {
      this.spinner.show();
      this.expresion = this.expresionDias;
      this.flagSoporte = this.validarRolMensaje();
      this.initData();
      this.initDatosInterfaces();
      this.initProcesos(this.initTipo);
      this.initSelects();
    } catch (err) {
      this.logeo.registrarLog('AUDITORIA INTERFACES', 'CARGAR PANTALLA', JSON.stringify(err));
    }
  }

  /* funcion para limpiar memoria al salir de la pantalla */
  ngOnDestroy(): void {
    this.initData();
    this.store.dispatch(UnsetCATPROCESO());
  }

  /* inicializar datos de las interfaces */
  initDatosInterfaces(): void {
    try {
      this.spinner.show();
      this.expresion = this.expresionDias;
      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaInicio.setDate(fechaFin.getDate() - this.dias);
      /* generacion del filtro inicial */
      const filtro = {
        fecha_inicio: fechaInicio.toISOString().split('T')[0],
        fecha_fin: fechaFin.toISOString().split('T')[0]
      };
      /* llamar al servicio de consulta para obtener los datos */
      this.interfasesService.getDatos(filtro).then(data => {
        this.dataOriginal = data;
        if (data === undefined) {
          /* validacion si no hay datos*/
          this.mensajeError = 'Ocurrió un error, contacte con soporte.';
          this.openModal();
          this.spinner.hide();
        } else {
          /* validacion si existio un error */
          this.flagDatos = this.interfasesService.isObjEmpty(data);
          if (data.hasOwnProperty('message')) {
            this.mensajeError = 'Ocurrió un error: ' + data.message;
            this.openModal();
          }
          this.datosDiurno = data.hasOwnProperty('diurnos');
          this.datosNocturno = data.hasOwnProperty('nocturnos');
          this.treemap = this.interfasesService.formatoResumen(data);
          /* generacion del grafico de resumen de las ejecuciones */
          if (this.treemap.length > 0) {
            this.treeMapNotEmpty = true;
            this.treemapProcess(this.treemap);
            this.treemapSelect(this.item);
          }
          this.spinner.hide();
        }
      });
    }
    catch (err) {
      /* manejo de errores en el proceso de inicializar interfaces */
      this.mensajeError = 'Ocurrió un error: ' + err.message;
      this.logeo.registrarLog('AUDITORIA INTERFACES', 'INICIALIZAR DATOS INTERFACES', JSON.stringify(err));
      this.openModal();
      this.spinner.hide();
    }
  }

  /* inicializacion de datos para los problemas identificados */
  initDatosProblemas(): void {
    try {
      this.spinner.show();
      this.expresion = this.expresionDias;
      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaInicio.setDate(fechaFin.getDate() - this.dias);
      /* generacion del filtro inicial por fechas */
      const filtro = {
        fecha_inicio: fechaInicio.toISOString().split('T')[0],
        fecha_fin: fechaFin.toISOString().split('T')[0]
      };
      /* llamado al api de consulta para obtener los datos */
      this.interfasesService.getProblemas(filtro).then(data => {
        if (data === undefined) {
          /* validacion si existe un error por falta de datos */
          this.mensajeError = 'Ocurrió un error, contacte con soporte.';
          this.openModal();
          this.spinner.hide();
        } else {
          this.listadoProblemas = data;
          if (data.hasOwnProperty('message')) {
            /* validacion si ocurrio un error */
            this.mensajeError = 'Ocurrió un error: ' + data.message;
            this.openModal();
          }
          this.spinner.hide();
        }
      });
    }
    catch (err) {
      /* manejo de errores en el proceso de inicializar problemas identificados */
      this.mensajeError = 'Ocurrió un error: ' + err.message;
      this.logeo.registrarLog('AUDITORIA INTERFACES', 'INICIALIZAR DATOS PROBLEMAS IDENTIFICADOS', JSON.stringify(err));
      this.openModal();
      this.spinner.hide();
    }
  }

  /* consulta de los datos por medio de la aplicacion de filtros */
  aplicarFiltro(): void {
    const pantalla = localStorage.getItem('tipoPantalla');
    const filtro = Object.create({});
    /* obtencion de valores  */
    this.spinner.show();
    if (this.selectedItemsFiltroProceso.length > 0) {
      filtro.proceso = this.selectedItemsFiltroProceso[0].item_id;
    }
    if (this.selectedItemsFiltroNegocio.length > 0) {
      filtro.negocio = this.selectedItemsFiltroNegocio[0].item_id;
    }
    if (this.selectedItemsFiltroTipo.length > 0) {
      filtro.tipo = this.selectedItemsFiltroTipo[0].item_id;
    }
    const fechaInicio = this.filtroForm.get('filtroFechaInicio').value; // yyyy-mm-dd
    const fechaFin = this.filtroForm.get('filtroFechaFin').value; // yyyy-mm-dd
    /* validacion de para los campos de fecha */
    if ((fechaInicio === null && fechaFin !== null) || (fechaInicio !== null && fechaFin === null)) {
      this.mensajeError = 'Es necesario introducir ambas fechas para poder filtrar las ejecuciones';
      this.openModal();
      this.spinner.hide();
    } else if (new Date(fechaInicio) > new Date(fechaFin)) {
      this.mensajeError = 'La fecha DEL (inicio de la búsqueda) debe ser menor a la fecha AL (fin de la búsqueda)';
      this.openModal();
      this.spinner.hide();
    }
    else {
      if (fechaInicio !== null) {
        if ((fechaInicio === fechaFin)) {
          this.expresion = 'del ' + this.interfasesService.formatDate(fechaInicio);
        } else {
          this.expresion = 'del ' + this.interfasesService.formatDate(fechaInicio) + ' al ' + this.interfasesService.formatDate(fechaFin);
        }
        filtro.fecha_inicio = fechaInicio + 'T00:00:00';
        filtro.fecha_fin = fechaFin + 'T24:00:00';
      }
      if (fechaInicio === null) {
        this.mensajeError = 'Debe introducir un rango de fechas para la búsqueda';
        this.openModal();
        this.spinner.hide();
      } else if (pantalla.includes('INTERFACES')) {
        /* aplicar filtro para interfaces */
        this.aplicarFiltroInterfaces(filtro);
      }
      else if (pantalla.includes('PROBLEMAS')) {
        if (this.interfasesService.isObjEmpty(filtro)) {
          this.mensajeError = 'Debe introducir al menos un parámetro de la búsqueda';
          this.openModal();
          this.spinner.hide();
        } else {
          /* aplicar filtro para problemas identificados */
          this.aplicarFiltroProblemas(filtro);
        }
      }
    }
  }

  /* aplicacion de filtro para las interfaces */
  aplicarFiltroInterfaces(filtro: any): void {
    try {
      /* consulta al servicio de obtencion de datos aplicando los filtros */
      this.interfasesService.getDatos(filtro).then(data => {
        this.dataOriginal = data;
        this.flagDatos = this.interfasesService.isObjEmpty(data);
        /* validacion por si no hay datos o se presento un error */
        if (data === undefined) {
          this.mensajeError = 'Ocurrió un error, contacte con soporte.';
          this.openModal();
          this.spinner.hide();
        } else {
          if (data.hasOwnProperty('message')) {
            this.mensajeError = 'Ocurrió un error: ' + data.message;
            this.openModal();
          }
          /* asignacion de datos para las graficas  */
          this.datosDiurno = data.hasOwnProperty('diurnos');
          this.datosNocturno = data.hasOwnProperty('nocturnos');
          this.treemap = this.interfasesService.formatoResumen(data);
          if (this.treemap.length > 0) {
            this.treeMapNotEmpty = true;
            this.treemapProcess(this.treemap);
            this.treemapSelect(this.item);
          }
          this.spinner.hide();
        }
      });
    }
    catch (err) {
      /* manejo de error */
      this.mensajeError = 'Ocurrió un error: ' + err.message;
      this.logeo.registrarLog('AUDITORIA INTERFACES', 'FILTRADO INTERFACES', JSON.stringify(err));
      this.openModal();
      this.spinner.hide();
    }
  }

  /* aplicar filtros de busqueda para los problemas identificados */
  aplicarFiltroProblemas(filtro: any): void {
    try {
      /* consulta para obtener los datos aplicando el filtro*/
      this.interfasesService.getProblemas(filtro).then(data => {
        this.listadoProblemas = data;
        if (data === undefined) {
          /* validaciones por si no hay datos o se presento un error en la consulta */
          this.mensajeError = 'Ocurrió un error, contacte con soporte.';
          this.openModal();
          this.spinner.hide();
        } else {
          if (data.hasOwnProperty('message')) {
            this.mensajeError = 'Ocurrió un error: ' + data.message;
            this.openModal();
          }
          this.spinner.hide();
        }
      });
    }
    catch (err) {
      /* manejo de errores en el proceso de inicializar problemas  */
      this.mensajeError = 'Ocurrió un error: ' + err.message;
      this.logeo.registrarLog('AUDITORIA INTERFACES', 'FILTRADO PROBLEMAS IDENTIFICADOS', JSON.stringify(err));
      this.openModal();
      this.spinner.hide();
    }
  }

  /* ajuste de banderas para componentes visuales sobre Diurno */
  accionMinimizarDiurno(): void {
    if (this.flagMinimizarDiurno === false) {
      this.datosAforeFondos = [];
      this.datosLanzamiento = [];
      /* asignacion de datos para los elementos graficos */
      this.datosAforeFondos = this.interfasesService.formatoDatosBarHorNegocio(this.dataOriginal, 'diurnos');
      this.datosLanzamiento = this.interfasesService.formatoDatosBarHorLanzamiento(this.dataOriginal, 'diurnos');
      this.datosDiurnoAfore = this.interfasesService.formatoDatosPie(this.dataOriginal, 'diurnos', 'afore');
      this.datosDiurnoFondos = this.interfasesService.formatoDatosPie(this.dataOriginal, 'diurnos', 'fondos');
    }
    this.flagMinimizarDiurno = !this.flagMinimizarDiurno;
  }

  /* ajuste de banderas para componentes visuales sobre Nocturno */
  accionMinimizarNocturno(): void {
    if (this.flagMinimizarNocturno === false) {
      this.datosAforeFondos = [];
      this.datosLanzamiento = [];
      /* asignacion de datos para los elementos graficos */
      this.datosAforeFondos = this.interfasesService.formatoDatosBarHorNegocio(this.dataOriginal, 'nocturnos');
      this.datosLanzamiento = this.interfasesService.formatoDatosBarHorLanzamiento(this.dataOriginal, 'nocturnos');
      this.datosNocturnoAfore = this.interfasesService.formatoDatosPie(this.dataOriginal, 'nocturnos', 'afore');
      this.datosNocturnoFondos = this.interfasesService.formatoDatosPie(this.dataOriginal, 'nocturnos', 'fondos');
    }
    this.flagMinimizarNocturno = !this.flagMinimizarNocturno;
  }

  /* mostrar el detalle del por negocio y proceso*/
  mostrarDetalleEjecuciones(data: any, tipo: string, negocio: string): void {
    tipo = this.interfasesService.capitalize(tipo);
    negocio = this.interfasesService.capitalize(negocio);
    const estado = this.interfasesService.capitalize(data.name);
    if (data.name.includes('Exito')) {
      this.tituloGrafico = 'Detalle ejecuciones exitosas de ' + tipo + ' ' + negocio;
    } else {
      this.tituloGrafico = 'Detalle ejecuciones fallidas de ' + tipo + ' ' + negocio;
    }
    if (tipo.includes('Diurno')) {
      this.detalleDiurno = true;
      this.detalleNocturno = false;
      this.datosDetalleDiurno = this.interfasesService.formatoDatosBarDetalle(this.dataOriginal, tipo, negocio, estado);
    } else {
      this.detalleDiurno = false;
      this.detalleNocturno = true;
      this.datosDetalleNocturno = this.interfasesService.formatoDatosBarDetalle(this.dataOriginal, tipo, negocio, estado);
    }
  }

  /* generar el grafico didactico de resumen de todas las ejecuciones */
  treemapProcess(treemap: any, sumBy = this.sumBy): void {
    this.sumBy = sumBy;
    const children = treemap[0];
    const value =
      sumBy === 'Size' ? sumChildren(children) : countChildren(children);
    this.treemap = [children];
    this.treemapPath = [];
    function sumChildren(node: any): any {
      return (node.value = node.size || d3.sum(node.children, sumChildren));
    }

    function countChildren(node: any): any {
      return (node.value = node.children
        ? d3.sum(node.children, countChildren)
        : 1);
    }
  }

  treemapSelect(item: any): void {
    let node;
    if (item.children) {
      const idx = this.treemapPath.indexOf(item);
      this.treemapPath.splice(idx + 1);
      this.treemap = this.treemapPath[idx].children;
      return;
    }
    node = this.treemap.find(d => d.name === item.name);
    if (node.children) {
      this.treemapPath.push(node);
      this.treemap = node.children;
    }
  }

  /* funcion que se encarga de generar el preview de los graficos para los reportes
    activando la opcion de descarga de los archivos pdf */
  generarReporte(): void {
    try {
      this.spinner.show();
      if (this.selectedItemsFiltroMes.length > 0 && this.selectedItemsFiltroTipoReporte.length > 0) {
        // asignar la variable para el mes y año del reporte
        const mes = this.selectedItemsFiltroMes[0].item_id;
        this.tipo = this.selectedItemsFiltroTipoReporte[0].item_id;
        const anio = new Date().getFullYear();
        const dias = EMeses.filter(element => element.id === mes);
        this.mesReporte = dias[0].descripcion;
        this.anioReporte = anio;
        if (this.tipo === 'ANUAL') {
          // generar reporte anual
          try {
            /* llamar al servicio de consulta para obtener los datos */
            this.interfasesService.obtenerDatosAnuales(EMeses, mes).then(data => {
              this.dataReporteAnual = data;
              if (this.interfasesService.isObjEmpty(data) === false) {
                // generar preview del reporte que habilita la descarga
                this.flagVisibilidadMensual = false;
                this.flagVisibilidadAnual = true;
                this.dataGraficaAnual = this.interfasesService.formatoGraficaAnual(data, EMeses);
                this.spinner.hide();
              } else {
                // no hay datos para el mes seleccionado
                this.mensajeError = 'No hay datos para el mes seleccionado.';
                this.openModal();
                this.spinner.hide();
              }
              if (data === undefined) {
                // no hay datos en la respuesta de la consulta
                this.mensajeError = 'No hay datos para esta búsqueda.';
                this.openModal();
                this.spinner.hide();
              }
            });
          } catch (err) {
            // manejo de error
            this.mensajeError = 'Ocurrió un error: ' + err.message;
            this.logeo.registrarLog('AUDITORIA INTERFACES', 'CONSULTAR DATOS PARA REPORTE ANUAL', JSON.stringify(err));
            this.limpiarFiltroReporte();
            this.openModal();
            this.spinner.hide();
          }
        } else if (this.tipo === 'MENSUAL') {
          // generar reporte mensual
          try {
            // generacion del filtrado por mes y año para la consulta
            const dias = EMeses.filter(element => element.id === mes);
            const dia = dias[0].dias;
            const filtro = {
              fecha_inicio: anio + '-' + mes + '-01',
              fecha_fin: anio + '-' + mes + '-' + dia
            };
            /* llamar al servicio de consulta para obtener los datos */
            this.interfasesService.getDatos(filtro).then(data => {
              this.dataReporteMensual = data;
              if (this.interfasesService.isObjEmpty(data) === false) {
                // generar reporte
                this.flagVisibilidadMensual = true;
                this.flagVisibilidadAnual = false;
                this.dataGraficaMensual = this.interfasesService.formatoGraficaMensual(data);
              } else {
                // no hay datos para el mes seleccionado
                this.mensajeError = 'No hay datos para el mes seleccionado.';
                this.openModal();
                this.spinner.hide();
              }
              if (data === undefined) {
                // no hay datos para el mes seleccionado
                this.mensajeError = 'No hay datos para esta búsqueda.';
                this.openModal();
                this.spinner.hide();
              } else {
                if (data.hasOwnProperty('message')) {
                  this.mensajeError = 'Ocurrió un error: ' + data.message;
                  this.openModal();
                }
                this.spinner.hide();
              }
            });
          } catch (err) {
            // manejo de error
            this.mensajeError = 'Ocurrió un error: ' + err.message;
            this.logeo.registrarLog('AUDITORIA INTERFACES', 'CONSULTAR DATOS PARA REPORTE MENSUAL', JSON.stringify(err));
            this.openModal();
            this.spinner.hide();
          }
        }
      } else {
        // validacion si no se han seleccionado mes y tipo para generar reporte
        this.mensajeError = 'Es necesario que introduzca el mes y tipo de reporte.'
        this.openModal();
        this.spinner.hide();
      }
    } catch (e) {
      /* manejo de error */
      this.mensajeError = 'Ocurrió un error: ' + e.message;
      this.logeo.registrarLog('AUDITORIA INTERFACES', 'GENERAR REPORTE', JSON.stringify(e));
      this.openModal();
      this.spinner.hide();
    }
  }

  // funcion para visibilizar u ocultar el boton para previsualizar el reporte
  visibilidadGenerar(): boolean {
    if (this.flagVisibilidadMensual === false && this.flagVisibilidadAnual === false) {
      // si ambos previws de los reportes estan ocultos entonces se puede generar un reporte
      return true
    } else {
      // si uno de los previes esta activo entonces no se genera reporte sino se habilita la descarga
      return false
    }
  }

  // funcion para descargar el reporte mensual en un archivo pdf
  descargarReporteMensual(): void {
    try {
      this.spinner.show();
      if (this.tipo === 'MENSUAL') {
        // obtencion del grafico para el reporte
        const chart = document.getElementById('reporteMensual');
        html2canvas(chart, {
          height: 300,
          width: 500,
          scale: 3,
          backgroundColor: null,
          logging: false,
          onclone: (document) => {
            document.getElementById('reporteMensual').style.visibility = 'visible';
          }
        }).then((canvas) => {
          // limpieza de la respuesta para convertir en un array
          const datosMensuales = this.interfasesService.formatoDatosReporteMensual(this.dataReporteMensual);
          // obtencion de datos limpios para el resumen de ejecuciones
          const resumen = this.interfasesService.resumenGraficoMensual(this.dataReporteMensual);// obtencion de la grafica renderizada
          const chartData = canvas.toDataURL();
          // generacion del estilo y contenido del archivo pdf
          const docDefinitionMensual = {
            footer: function (currentPage, pageCount, pageSize) {
              return [
                { text: 'pág. ' + currentPage + ' de ' + pageCount, alignment: (currentPage % 2) ? 'center' : 'center' },
                { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }] }
              ]
            },
            watermark: { text: 'Información de uso interno', color: 'gray', opacity: 0.2, bold: false, italics: false },
            content: [
            ],
            styles: {
              titulo: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5],
                alignment: 'center'
              },
              subtitulo: {
                fontSize: 14,
                italics: true,
                bold: true,
                margin: [0, 5, 0, 5],
                alignment: 'left',
                color: '#035fa4'
              },
              texto: {
                fontSize: 12,
                italics: false,
                margin: [0, 0, 0, 0],
                alignment: 'justify'
              }
            },
            defaultStyle: {
              alignment: 'justify'
            }
          };
          const title = { text: 'Reporte de ejecuciones de interfaces durante ' + this.mesReporte + ' ' + this.anioReporte, style: 'titulo' };
          const description = { text: 'A continuación, se muestra el detalle de las ejecuciones por cada interfaz.', style: 'texto' };
          const descDiurno = { text: 'Detalle de los procesos Diurnos', style: 'subtitulo' };
          const descNocturno = { text: 'Detalle de los procesos Nocturnos', style: 'subtitulo' };
          const espacio = { text: ' ', style: 'subtitulo' };
          const detalleDiurno = {
            ul: [
              { text: 'Afore', bold: true, italics: false },
              {
                ul: [
                  'Exitosos: ' + resumen.diurnoAforeExito,
                  'Fallidos: ' + resumen.diurnoAforeFallo,
                  { text: 'Total: ' + resumen.diurnoAforeTotal, bold: true, italics: true },
                ]
              },
              { text: 'Fondos', bold: true, italics: false },
              {
                ul: [
                  'Exitosos: ' + resumen.diurnoFondosExito,
                  'Fallidos: ' + resumen.diurnoFondosFallo,
                  { text: 'Total: ' + resumen.diurnoFondosTotal, bold: true, italics: true },
                ]
              }
            ]
          };
          const detalleNocturno = {
            ul: [
              { text: 'Afore', bold: true, italics: false },
              {
                ul: [
                  'Exitosos: ' + resumen.nocturnoAforeExito,
                  'Fallidos: ' + resumen.nocturnoAforeFallo,
                  { text: 'Total: ' + resumen.nocturnoAforeTotal, bold: true, italics: true },
                ]
              },
              { text: 'Fondos', bold: true, italics: false },
              {
                ul: [
                  'Exitosos: ' + resumen.nocturnoFondosExito,
                  'Fallidos: ' + resumen.nocturnoFondosFallo,
                  { text: 'Total: ' + resumen.nocturnoFondosTotal, bold: true, italics: true },
                ]
              }
            ]
          };
          const grafica = {
            image: chartData,
            width: 400,
            alignment: 'center'
          };
          const tabla = {
            layout: 'lightHorizontalLines',
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto'],
              body: datosMensuales
            }
          };
          const img = {
            image: "data:image/png;base64,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",
            width: 150,
            alignment: 'right'
          };
          // se añade el contenido al archivo en el orden deseado de acuerdo a la configuracion
          docDefinitionMensual.content.push(img);
          docDefinitionMensual.content.push(title);
          docDefinitionMensual.content.push(grafica);
          docDefinitionMensual.content.push(espacio);
          docDefinitionMensual.content.push(descDiurno);
          docDefinitionMensual.content.push(detalleDiurno);
          docDefinitionMensual.content.push(espacio);
          docDefinitionMensual.content.push(descNocturno);
          docDefinitionMensual.content.push(detalleNocturno);
          docDefinitionMensual.content.push(espacio);
          docDefinitionMensual.content.push(espacio);
          docDefinitionMensual.content.push(description);
          docDefinitionMensual.content.push(tabla);
          // asignacion del documento final para posteriormente descargar el pdf
          this.docDefinitionMensual = docDefinitionMensual;
          if (this.docDefinitionMensual) {
            // creacion del archivo formato pdf con el contenido agregado
            pdfMake.createPdf(this.docDefinitionMensual).download('Reporte_Mensual_' + this.mesReporte + '.pdf');
            // mensaje para confirmar la descarga del archivo
            this.mensajeError = 'Se ha descargado el reporte con nombre: Reporte_Mensual_' + this.mesReporte + '.pdf';
            this.limpiarFiltroReporte();
            this.openModal();
            this.spinner.hide();
          } else {
            // mensaje de error si no se inicio la descarga del archivo
            this.mensajeError = 'No se ha podido descargar el archivo. Intente nuevamente.';
            this.limpiarFiltroReporte();
            this.openModal();
            this.spinner.hide();
          }
        });
      }
    }
    catch (err) {
      // manejo de error
      this.mensajeError = 'Fallo al descargar el reporte: ' + err.message;
      this.logeo.registrarLog('AUDITORIA INTERFACES', 'DESCARGAR REPORTE', JSON.stringify(err));
      this.limpiarFiltroReporte();
      this.openModal();
      this.spinner.hide();
    }
  }

  // funcion para descargar el reporte anual en un archivo pdf
  descargarReporteAnual(): void {
    try {
      this.spinner.show();
      if (this.tipo === 'ANUAL') {
        // obtencion del grafico generado para el reporte
        const chart = document.getElementById('reporteAnual');
        html2canvas(chart, {
          height: 300,
          width: 500,
          scale: 3,
          backgroundColor: null,
          logging: false,
          onclone: (document) => {
            document.getElementById('reporteAnual').style.visibility = 'visible';
          }
        }).then((canvas) => {
          // limpieza de la respuesta para convertir en un array
          const datosAnuales = this.interfasesService.formatoDatosReporteAnual(this.dataReporteAnual, EMeses);
          // obtencion de los datos formateados para mostrar el resumen de ejecuciones
          const resumen = this.interfasesService.resumenGraficoAnual(this.dataReporteAnual);
          // obtencion de la grafica renderizada
          const chartData = canvas.toDataURL();
          // generacion del estilo y contenido del archivo pdf
          const docDefinitionMensual = {
            footer: function (currentPage, pageCount, pageSize) {
              return [
                { text: 'pág. ' + currentPage + ' de ' + pageCount, alignment: (currentPage % 2) ? 'center' : 'center' },
                { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }] }
              ]
            },
            watermark: { text: 'Información de uso interno', color: 'gray', opacity: 0.2, bold: false, italics: false },
            content: [
            ],
            styles: {
              titulo: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5],
                alignment: 'center'
              },
              subtitulo: {
                fontSize: 14,
                italics: true,
                bold: true,
                margin: [0, 5, 0, 5],
                alignment: 'left',
                color: '#035fa4'
              },
              texto: {
                fontSize: 12,
                italics: false,
                margin: [0, 0, 0, 0],
                alignment: 'justify'
              }
            },
            defaultStyle: {
              alignment: 'justify'
            }
          };
          const title = { text: 'Reporte anual de ejecuciones de interfaces durante ' + this.mesReporte + ' ' + this.anioReporte, style: 'titulo' };
          const description = { text: 'A continuación, se muestra el detalle de las ejecuciones por cada interfaz.', style: 'texto' };
          const descDiurno = { text: 'Detalle de los procesos Diurnos', style: 'subtitulo' };
          const descNocturno = { text: 'Detalle de los procesos Nocturnos', style: 'subtitulo' };
          const espacio = { text: ' ', style: 'subtitulo' };
          const detalleDiurno = {
            ul: [
              { text: 'Afore', bold: true, italics: false },
              {
                ul: [
                  'Exitosos: ' + resumen.diurnoAforeExito,
                  'Fallidos: ' + resumen.diurnoAforeFallo,
                  { text: 'Total: ' + resumen.diurnoAforeTotal, bold: true, italics: true },
                ]
              },
              { text: 'Fondos', bold: true, italics: false },
              {
                ul: [
                  'Exitosos: ' + resumen.diurnoFondosExito,
                  'Fallidos: ' + resumen.diurnoFondosFallo,
                  { text: 'Total: ' + resumen.diurnoFondosTotal, bold: true, italics: true },
                ]
              }
            ]
          };
          const detalleNocturno = {
            ul: [
              { text: 'Afore', bold: true, italics: false },
              {
                ul: [
                  'Exitosos: ' + resumen.nocturnoAforeExito,
                  'Fallidos: ' + resumen.nocturnoAforeFallo,
                  { text: 'Total: ' + resumen.nocturnoAforeTotal, bold: true, italics: true },
                ]
              },
              { text: 'Fondos', bold: true, italics: false },
              {
                ul: [
                  'Exitosos: ' + resumen.nocturnoFondosExito,
                  'Fallidos: ' + resumen.nocturnoFondosFallo,
                  { text: 'Total: ' + resumen.nocturnoFondosTotal, bold: true, italics: true },
                ]
              }
            ]
          };
          const grafica = {
            image: chartData,
            width: 400,
            alignment: 'center'
          };
          const tabla = {
            layout: 'lightHorizontalLines',
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto'],
              body: datosAnuales
            }
          };
          const img = {
            image: "data:image/png;base64,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",
            width: 150,
            alignment: 'right'
          };
          // se añade el contenido al archivo pdf en el orden deseado de acuerdo a la configuracion anterior
          docDefinitionMensual.content.push(img);
          docDefinitionMensual.content.push(title);
          docDefinitionMensual.content.push(grafica);
          docDefinitionMensual.content.push(espacio);
          docDefinitionMensual.content.push(descDiurno);
          docDefinitionMensual.content.push(detalleDiurno);
          docDefinitionMensual.content.push(espacio);
          docDefinitionMensual.content.push(descNocturno);
          docDefinitionMensual.content.push(detalleNocturno);
          docDefinitionMensual.content.push(espacio);
          docDefinitionMensual.content.push(espacio);
          docDefinitionMensual.content.push(description);
          docDefinitionMensual.content.push(tabla);
          // asignacion global del reporte para descargar el archivo
          this.docDefinitionMensual = docDefinitionMensual;
          if (this.docDefinitionMensual) {
            // creacion del archivo formato pdf con el contenido agregado
            pdfMake.createPdf(this.docDefinitionMensual).download('Reporte_Anual_' + this.mesReporte + '.pdf');
            // mensaje de confirmacion de la descarga del archivo
            this.mensajeError = 'Se ha descargado el reporte con nombre: Reporte_Anual_' + this.mesReporte + '.pdf';
            this.limpiarFiltroReporte();
            this.openModal();
            this.spinner.hide();
          } else {
            // mensaje si no se ha podido descargar el archivo
            this.mensajeError = 'No se ha podido descargar el archivo. Intente nuevamente. ';
            this.limpiarFiltroReporte();
            this.openModal();
            this.spinner.hide();
          }
        });
      }
    }
    catch (err) {
      // manejo de error
      this.mensajeError = 'Fallo al descargar el reporte: ' + err.message;
      this.logeo.registrarLog('AUDITORIA INTERFACES', 'DESCARGAR REPORTE', JSON.stringify(err));
      this.limpiarFiltroReporte();
      this.openModal();
      this.spinner.hide();
    }
  }

}
