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
  filtro = '?fecha_inicio=2021-05-22&fecha_fin=2021-06-24';
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
        this.datosDiurno = data.hasOwnProperty('diurnos');
        this.datosNocturno = data.hasOwnProperty('nocturnos');
        this.treemap = this.interfasesService.formatoResumen(data);
        if (this.treemap.length > 0) {
          this.treeMapNotEmpty = true;
          this.treemapProcess(this.treemap);
          this.treemapSelect(item);
        }
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
    // console.log("accion", this.flagMinimizarNocturno)
    if (this.flagMinimizarNocturno === false) {
      this.datosAforeFondos = [];
      this.datosLanzamiento = [];
      this.datosAforeFondos = this.interfasesService.formatoDatosBarHorNegocio(this.dataOriginal, 'nocturnos');
      this.datosLanzamiento = this.interfasesService.formatoDatosBarHorLanzamiento(this.dataOriginal, 'nocturnos');
      this.datosNocturnoAfore = this.interfasesService.formatoDatosPie(this.dataOriginal, 'nocturnos', 'afore');
      this.datosNocturnoFondos = this.interfasesService.formatoDatosPie(this.dataOriginal, 'nocturnos', 'fondos');
      console.log('datosLanzamiento', this.datosLanzamiento);
      console.log('datosAforeFondos', this.datosAforeFondos);
      console.log('datosNocturnoAfore', this.datosNocturnoAfore);
      console.log('datosNocturnoFondos', this.datosNocturnoFondos);
    }
    this.flagMinimizarNocturno = !this.flagMinimizarNocturno;
  }

  mostrarDetalleEjecuciones(data: any, tipo: string, negocio: string): void {
    tipo = this.interfasesService.capitalize(tipo);
    negocio = this.interfasesService.capitalize(negocio);
    const estado = this.interfasesService.capitalize(data.name);
    // console.log('mostrarDetalleEjecuciones', data, tipo, negocio, estado);
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
