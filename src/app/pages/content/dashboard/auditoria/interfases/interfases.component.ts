import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfasesService } from 'src/app/services/interfases.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as d3 from 'd3';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ERole } from 'src/app/validators/roles';
import { EArea } from './../../../../../validators/roles';
import { Observable, of, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { CATPROCESOS_INTERFACE } from '../../../../../model/CATPROCESOS.model';
import { LoadCATPROCESOS, UnsetCATPROCESO } from 'src/app/ReduxStore/actions';
declare var $: any;

@Component({
  selector: 'app-interfases',
  templateUrl: './interfases.component.html',
  styleUrls: ['./interfases.component.css']
})

export class InterfasesComponent implements OnInit, OnDestroy {
  @ViewChild('modalEstado') templateRef: TemplateRef<any>;

  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- ********* F I L T R O S ************** -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
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

  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- ********* D A T O S ****************** -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
  CATPROCESOS$: Observable<CATPROCESOS_INTERFACE[]>;
  CATPROCESOS: CATPROCESOS_INTERFACE[];
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

  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- ********* B A N D E R A S ************ -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
  detalleDiurno = false;
  detalleNocturno = false;
  flagDatos: boolean;
  flagMinimizarDiurno = false;
  flagMinimizarNocturno = false;
  flagSoporte = false;
  paginaActual = 1;
  dias = 30;
  expresionDias = 'de los últimos 30 días';
  expresion = '';
  initTipo = 'DIURNO';
  mensajeError: string;
  helpTitulo = '';
  helpBody = '';
  item = {
    name: 'Ejecuciones'
  };
  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- ********* G R A F I C O S************* -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
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

  constructor(
    private spinner: NgxSpinnerService,
    private interfasesService: InterfasesService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private store: Store<AppState>) {
  }

  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- *** A C C I O N E S _ C O M U N E S ** -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
  initData = () => {
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
  }

  initSelects = () => {
    this.dropdownListFiltroTipo = [
      { item_id: 'DIURNO', item_text: 'DIURNOS' },
      { item_id: 'NOCTURNO', item_text: 'NOCTURNOS' },
    ];
    this.dropdownListFiltroNegocio = [
      { item_id: 'AFORE', item_text: 'AFORE' },
      { item_id: 'FONDOS', item_text: 'FONDOS' },
    ];
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
    this.filtroForm = this.fb.group({
      filtroFechaInicio: [],
      filtroFechaFin: []
    });
  }

  initProcesos(tipo: string): void {
    const bodyProcesos = {
      filter: { TIPO: { eq: tipo.toUpperCase() } },
      limit: 1000
    };
    this.store.dispatch(LoadCATPROCESOS({ consult: bodyProcesos }));
  }

  limpiarFiltro(pantalla: string): void {
    if (pantalla.length < 1) {
      pantalla = localStorage.getItem('tipoPantalla');
    }
    this.selectedItemsFiltroTipo = [];
    this.selectedItemsFiltroNegocio = [];
    this.selectedItemsFiltroProceso = [];
    this.filtroForm.reset();
    if (pantalla.includes('INTERFACES')) {
      this.initDatosInterfaces();
    } else if (pantalla.includes('PROBLEMAS')) {
      this.initDatosProblemas();
    }
  }

  setPantalla(pantalla: string): void {
    localStorage.setItem('tipoPantalla', pantalla);
    this.limpiarFiltro(pantalla);
  }

  botonActivado = (pantalla: string): boolean => {
    return localStorage.getItem('tipoPantalla') === pantalla
      ? true
      : false;
  }

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
    }
  }

  openModal(): void {
    this.modalService.open(this.templateRef, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  cerrarModales = () => {
    this.modalService.dismissAll();
  }

  validarRolMensaje(): boolean {
    let flag = false;
    if (localStorage.getItem('area').includes(EArea.Soporte)) {
      flag = true;
    }
    return flag;
  }

  cambiarEtiquetaSeleccionadaGeneral(elemento: any): void {
    setTimeout(() => {
      $('#' + elemento)
        .find('.selected-item')
        .attr('class', 'etiquetasCatalogos');
    }, 1);
  }

  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- ******** O N I N I T ***************** -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
  ngOnInit(): void {
    this.spinner.show();
    this.expresion = this.expresionDias;
    this.flagSoporte = this.validarRolMensaje();
    this.initData();
    this.initDatosInterfaces();
    this.initProcesos(this.initTipo);
    this.initSelects();
  }

  ngOnDestroy(): void {
    this.initData();
    this.store.dispatch(UnsetCATPROCESO());
  }

  initDatosInterfaces(): void {
    try {
      this.spinner.show();
      this.expresion = this.expresionDias;
      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaInicio.setDate(fechaFin.getDate() - this.dias);
      const filtro = {
        fecha_inicio: fechaInicio.toISOString().split('T')[0],
        fecha_fin: fechaFin.toISOString().split('T')[0]
      };
      this.interfasesService.getDatos(filtro).then(data => {
        this.dataOriginal = data;
        this.flagDatos = this.interfasesService.isObjEmpty(data);
        if (data.hasOwnProperty('message')) {
          this.mensajeError = 'Ocurrió un error: ' + data.message;
          this.openModal();
        }
        this.datosDiurno = data.hasOwnProperty('diurnos');
        this.datosNocturno = data.hasOwnProperty('nocturnos');
        this.treemap = this.interfasesService.formatoResumen(data);
        if (this.treemap.length > 0) {
          this.treeMapNotEmpty = true;
          this.treemapProcess(this.treemap);
          this.treemapSelect(this.item);
        }
        this.spinner.hide();
      });
    }
    catch (err) {
      this.mensajeError = 'Ocurrió un error: ' + err.message;
      this.openModal();
      this.spinner.hide();
    }
  }

  initDatosProblemas(): void {
    try {
      this.spinner.show();
      this.expresion = this.expresionDias;
      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaInicio.setDate(fechaFin.getDate() - this.dias);
      const filtro = {
        fecha_inicio: fechaInicio.toISOString().split('T')[0],
        fecha_fin: fechaFin.toISOString().split('T')[0]
      };
      this.interfasesService.getProblemas(filtro).then(data => {
        this.listadoProblemas = data;
        if (data.hasOwnProperty('message')) {
          this.mensajeError = 'Ocurrió un error: ' + data.message;
          this.openModal();
        }
        this.spinner.hide();
      });
    }
    catch (err) {
      this.mensajeError = 'Ocurrió un error: ' + err.message;
      this.openModal();
      this.spinner.hide();
    }
  }

  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- **** A C C I O N F I L T R O S ******* -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
  aplicarFiltro(): void {
    const pantalla = localStorage.getItem('tipoPantalla');
    const filtro = Object.create({});
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
      if (pantalla.includes('INTERFACES')) {
        if (fechaInicio === null) {
          this.mensajeError = 'Debe introducir un rango de fechas para la búsqueda';
          this.openModal();
          this.spinner.hide();
        } else {
          this.aplicarFiltroInterfaces(filtro);
        }
      } else if (pantalla.includes('PROBLEMAS')) {
        if (this.interfasesService.isObjEmpty(filtro)) {
          this.mensajeError = 'Debe introducir al menos un parámetro de la búsqueda';
          this.openModal();
          this.spinner.hide();
        } else {
          this.aplicarFiltroProblemas(filtro);
        }
      }
    }
  }

  aplicarFiltroInterfaces(filtro: any): void {
    try {
      this.interfasesService.getDatos(filtro).then(data => {
        this.dataOriginal = data;
        this.flagDatos = this.interfasesService.isObjEmpty(data);
        if (data.hasOwnProperty('message')) {
          this.mensajeError = 'Ocurrió un error: ' + data.message;
          this.openModal();
        }
        this.datosDiurno = data.hasOwnProperty('diurnos');
        this.datosNocturno = data.hasOwnProperty('nocturnos');
        this.treemap = this.interfasesService.formatoResumen(data);
        if (this.treemap.length > 0) {
          this.treeMapNotEmpty = true;
          this.treemapProcess(this.treemap);
          this.treemapSelect(this.item);
        }
        this.spinner.hide();
      });
    }
    catch (err) {
      this.mensajeError = 'Ocurrió un error: ' + err.message;
      this.openModal();
      this.spinner.hide();
    }
  }

  aplicarFiltroProblemas(filtro: any): void {
    try {
      this.interfasesService.getProblemas(filtro).then(data => {
        this.listadoProblemas = data;
        if (data.hasOwnProperty('message')) {
          this.mensajeError = 'Ocurrió un error: ' + data.message;
          this.openModal();
        }
        this.spinner.hide();
      });
    }
    catch (err) {
      this.mensajeError = 'Ocurrió un error: ' + err.message;
      this.openModal();
      this.spinner.hide();
    }
  }

  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- *** M O S T R A R _ G R A F I C O S ** -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
  accionMinimizarDiurno(): void {
    if (this.flagMinimizarDiurno === false) {
      this.datosAforeFondos = [];
      this.datosLanzamiento = [];
      this.datosAforeFondos = this.interfasesService.formatoDatosBarHorNegocio(this.dataOriginal, 'diurnos');
      this.datosLanzamiento = this.interfasesService.formatoDatosBarHorLanzamiento(this.dataOriginal, 'diurnos');
      this.datosDiurnoAfore = this.interfasesService.formatoDatosPie(this.dataOriginal, 'diurnos', 'afore');
      this.datosDiurnoFondos = this.interfasesService.formatoDatosPie(this.dataOriginal, 'diurnos', 'fondos');
    }
    this.flagMinimizarDiurno = !this.flagMinimizarDiurno;
  }

  accionMinimizarNocturno(): void {
    if (this.flagMinimizarNocturno === false) {
      this.datosAforeFondos = [];
      this.datosLanzamiento = [];
      this.datosAforeFondos = this.interfasesService.formatoDatosBarHorNegocio(this.dataOriginal, 'nocturnos');
      this.datosLanzamiento = this.interfasesService.formatoDatosBarHorLanzamiento(this.dataOriginal, 'nocturnos');
      this.datosNocturnoAfore = this.interfasesService.formatoDatosPie(this.dataOriginal, 'nocturnos', 'afore');
      this.datosNocturnoFondos = this.interfasesService.formatoDatosPie(this.dataOriginal, 'nocturnos', 'fondos');
    }
    this.flagMinimizarNocturno = !this.flagMinimizarNocturno;
  }

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

  treemapProcess(treemap: any, sumBy = this.sumBy): void {
    this.sumBy = sumBy;
    const children = treemap[0];
    const value =
      sumBy === 'Size' ? sumChildren(children) : countChildren(children);
    this.treemap = [children];
    // this.treemapPath = [{ name: 'Top', children: [children], value }];
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
}
