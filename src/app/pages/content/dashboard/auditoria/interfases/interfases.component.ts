import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfasesService } from 'src/app/services/interfases.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as d3 from 'd3';

@Component({
  selector: 'app-interfases',
  templateUrl: './interfases.component.html',
  styleUrls: ['./interfases.component.css']
})

export class InterfasesComponent implements OnInit {

  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- ********* F I L T R O S ************** -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
  filtro = '?fecha_inicio=2021-05-22&fecha_fin=2021-06-22';
  maxDate: Date = new Date();
  filtroForm: FormGroup;
  dropdownListFiltroTipo = [];
  SettingsFiltroDeTipo: IDropdownSettings = {};
  selectedItemsFiltroTipo = [];
  dropdownListFiltroNegocio = [];
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
  dataOriginal: any;
  treeMapNotEmpty = false;
  single: any[];
  datosDiurnoAfore: any[];
  datosDiurnoFondos: any[];
  datosNocturnoAfore: any[];
  datosNocturnoFondos: any[];
  datosDetalleExito: any[];
  datosDetalleFallo: any[];
  datosDetalleExitoNocturno: any[];
  datosDetalleFalloNocturno: any[];
  datosAforeFondos: any[];
  datosLanzamiento: any[];
  datosAforeFondosNocturno: any[];
  datosLanzamientoNocturno: any[];

  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- ********* B A N D E R A S ************ -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
  detalleExito = false;
  detalleFallo = false;
  detalleExitoNocturno = false;
  detalleFalloNocturno = false;
  flagMinimizarDiurno = false;
  flagMinimizarNocturno = false;
  helpTitulo = '';
  helpBody = '';

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
    private fb: FormBuilder) {
  }

  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- *** A C C I O N E S _ C O M U N E S ** -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
  initSelects = () => {
    this.dropdownListFiltroTipo = [
      { item_id: 'DIURNO', item_text: 'DIURNO' },
      { item_id: 'NOCTURNO', item_text: 'NOCTURNO' },
    ];
    this.dropdownListFiltroNegocio = [
      { item_id: 'AFORE', item_text: 'AFORE' },
      { item_id: 'FONDOS', item_text: 'FONDOS' },
    ];
    this.dropdownListFiltroProceso = [
      { item_id: 'AFORE', item_text: 'MD' },
      { item_id: 'FONDOS', item_text: 'MO' },
    ];
    this.SettingsFiltroDeNegocio = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      clearSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
    };
    this.SettingsFiltroDeTipo = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      clearSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
    };
    this.SettingsFiltroDeProceso = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      clearSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
    };
    this.filtroForm = this.fb.group({
      filtroFecha: []
    });
  }

  limpirarFiltro(): void {
    this.selectedItemsFiltroTipo = [];
    this.selectedItemsFiltroNegocio = [];
  }

  setPantalla(tipo: string): void {
    localStorage.setItem('tipoPantalla', tipo);
  }

  botonActivado = (comparar: string): boolean => {
    return localStorage.getItem('tipoPantalla') === comparar
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

  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- ****** M A N E J O _ F L A G S ******* -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
  mostrarDetalleExito(): boolean {
    return this.detalleExito === true
      ? true
      : false;
  }

  mostrarDetalleFallos(): boolean {
    return this.detalleFallo === true
      ? true
      : false;
  }

  mostrarDetalleExitoNocturno(): boolean {
    return this.detalleExitoNocturno === true
      ? true
      : false;
  }

  mostrarDetalleFallosNocturno(): boolean {
    return this.detalleFalloNocturno === true
      ? true
      : false;
  }

  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- ******** O N I N I T ***************** -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
  ngOnInit(): void {
    this.spinner.show();
    localStorage.setItem('tipoPantalla', 'INTERFASES');
    this.initSelects();
    const item = {
      name: 'Ejecuciones'
    };
    try {
      this.interfasesService.getDatos(this.filtro).then(data => {
        this.dataOriginal = data;
        this.treemap = this.interfasesService.formatoResumen(data);
        if (this.treemap.length > 0) {
          this.treeMapNotEmpty = true;
          this.treemapProcess(this.treemap);
          this.treemapSelect(item);
        }
        // las siguientes asignaciones van a cambiar, se dejan para vista
        this.single = this.interfasesService.single;
        this.datosNocturnoAfore = this.interfasesService.two;
        this.datosNocturnoFondos = this.interfasesService.two;
        this.spinner.hide();
      });
    }
    catch (err) {
      console.log(err);
      this.spinner.hide();
    }
  }

  /*-- ************************************** -->
  <!-- ************************************** -->
  <!-- *** M O S T R A R _ G R A F I C O S ** -->
  <!-- ************************************** -->
  <!-- ************************************** -*/
  accionMinimizarDiurno(): void {
    // console.log("accion", this.flagMinimizarDiurno)
    if (this.flagMinimizarDiurno === false) {
      this.datosAforeFondos = this.interfasesService.formatoDatosBarHorNegocio(this.dataOriginal, 'diurnos');
      this.datosLanzamiento = this.interfasesService.formatoDatosBarHorLanzamiento(this.dataOriginal, 'diurnos');
      this.datosDiurnoAfore = this.interfasesService.formatoDatosPie(this.dataOriginal, 'diurnos', 'afore');
      this.datosDiurnoFondos = this.interfasesService.formatoDatosPie(this.dataOriginal, 'diurnos', 'fondos');
    }
    this.flagMinimizarDiurno = !this.flagMinimizarDiurno;
  }

  accionMinimizarNocturno(): void {
    // console.log("accion", this.flagMinimizarNocturno)
    if (this.flagMinimizarNocturno === false) {
      this.datosAforeFondosNocturno = [];
      this.datosLanzamientoNocturno = [];
      this.datosNocturnoAfore = [];
      this.datosNocturnoFondos = [];
    }
    this.flagMinimizarNocturno = !this.flagMinimizarNocturno;
  }

  mostrarDetalleDiurnoAfore(data: any): void {
    // console.log('mostrarDetalleDiurnoAfore', JSON.parse(JSON.stringify(data)));
    if (!data.extra.fail) {
      this.detalleExito = true;
      this.detalleFallo = false;
      this.detalleExitoNocturno = false;
      this.detalleFalloNocturno = false;
      this.tituloGrafico = 'Detalle ejecuciones exitosas de Diurno Afore';
    } else {
      this.detalleExito = false;
      this.detalleFallo = true;
      this.detalleExitoNocturno = false;
      this.detalleFalloNocturno = false;
      this.tituloGrafico = 'Detalle ejecuciones fallidas de Diurno Afore';
    }
  }

  mostrarDetalleDiurnoFondos(data: any): void {
    // console.log('mostrarDetalleDiurnoFondos', JSON.parse(JSON.stringify(data)));
    if (!data.extra.fail) {
      this.detalleExito = true;
      this.detalleFallo = false;
      this.detalleExitoNocturno = false;
      this.detalleFalloNocturno = false;
      this.tituloGrafico = 'Detalle ejecuciones exitosas de Diurno Fondos';
    } else {
      this.detalleExito = false;
      this.detalleFallo = true;
      this.detalleExitoNocturno = false;
      this.detalleFalloNocturno = false;
      this.tituloGrafico = 'Detalle ejecuciones fallidas de Diurno Fondos';
    }
  }

  mostrarDetalleNocturnoAfore(data: any): void {
    // console.log('mostrarDetalleNocturnoAfore', JSON.parse(JSON.stringify(data)));
    if (!data.extra.fail) {
      this.detalleExito = false;
      this.detalleFallo = false;
      this.detalleExitoNocturno = true;
      this.detalleFalloNocturno = false;
      this.tituloGraficoNocturno = 'Detalle ejecuciones exitosas de Nocturno Afore';
    } else {
      this.detalleExito = false;
      this.detalleFallo = false;
      this.detalleExitoNocturno = false;
      this.detalleFalloNocturno = true;
      this.tituloGraficoNocturno = 'Detalle ejecuciones fallidas de Nocturno Afore';
    }
  }

  mostrarDetalleNocturnoFondos(data: any): void {
    // console.log('mostrarDetalleNocturnoFondos', JSON.parse(JSON.stringify(data)));
    if (!data.extra.fail) {
      this.detalleExito = true;
      this.detalleFallo = false;
      this.detalleExitoNocturno = true;
      this.detalleFalloNocturno = false;
      this.tituloGraficoNocturno = 'Detalle ejecuciones exitosas de Nocturno Fondos';
    } else {
      this.detalleExito = false;
      this.detalleFallo = true;
      this.detalleExitoNocturno = false;
      this.detalleFalloNocturno = true;
      this.tituloGraficoNocturno = 'Detalle ejecuciones fallidas de Nocturno Fondos';
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
    // console.log(item);
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
