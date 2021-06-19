import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { InterfasesService } from 'src/app/services/interfases.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-interfases',
  templateUrl: './interfases.component.html',
  styleUrls: ['./interfases.component.css']
})

export class InterfasesComponent implements OnInit {

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

  detalleExito = false;
  detalleFallo = false;

  single: any[];
  datosDiurnoAfore: any[];
  datosDiurnoFondos: any[];
  datosNocturnoAfore: any[];
  datosNocturnoFondos: any[];
  datosDetalleExito: any[];
  datosDetalleFallo: any[];
  datosAforeFondos: any[];
  datosLanzamiento: any[];
  tituloGraficoExito = '';
  tituloGraficoFallo = '';

  // options
  tooltipDisabled = false;
  explodeSlices = false;
  gradient = true;
  showLegend = true;
  showLabels = true;
  showLabelsPie = true;
  isDoughnut = false;
  gradientBar = true;
  gradientPie = true;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  legendPosition = 'below';
  legendTitle = 'Datos';
  yAxisLabel = 'Tipo';
  yAxisLabelNegocio = 'Negocio';
  xAxisLabel = 'Número de ejecuciones';
  colorScheme = {
    domain: ['#5AA454', '#A10A28']
  };
  view = [400, 150];
  pieTooltipText({ data }) {
    const label = data.name;
    const val = data.value;
    const extra = data.extra.code;
    return `
      <span class="tooltip-label">${label}</span>
      <span class="tooltip-val">${val} - ${extra}</span>
    `;
  }
  setLabelFormatting(name: any): string {
    let self: any = this;
    let data = self.series.filter(x => x.name == name);
    if (data.length > 0) {
      return `${data[0].value}`;
    } else {
      return name;
    }
  }

  constructor(
    private spinner: NgxSpinnerService,
    private ngxCharts: NgxChartsModule,
    private interfasesService: InterfasesService,
    private fb: FormBuilder) {
  }

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
    })
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

  mostrarDetalleExito() {
    return this.detalleExito === true
      ? true
      : false;
  }

  mostrarDetalleFallos() {
    return this.detalleFallo === true
      ? true
      : false;
  }

  ngOnInit(): void {
    this.spinner.show();
    localStorage.setItem('tipoPantalla', 'INTERFASES');
    this.initSelects();
    this.single = this.interfasesService.single;
    this.datosAforeFondos = this.interfasesService.tree;
    this.datosLanzamiento = this.interfasesService.four;
    this.datosDiurnoAfore = this.interfasesService.two;
    this.datosDiurnoFondos = this.interfasesService.two;
    this.datosNocturnoAfore = this.interfasesService.two;
    this.datosNocturnoFondos = this.interfasesService.two;
    this.spinner.hide();
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  cambiarEtiquetaSeleccionadaGeneral(paramTipo: string): void {

  }

  mostrarDetalleDiurnoAfore(data: any): void {
    console.log('mostrarDetalleDiurnoAfore', JSON.parse(JSON.stringify(data)));
    if (!data.extra.fail) {
      this.detalleExito = true;
      this.detalleFallo = false;
      this.tituloGraficoExito = 'Detalle ejecuciones exitosas de Diurno Afore';
    } else {
      this.detalleExito = false;
      this.detalleFallo = true;
      this.tituloGraficoFallo = 'Detalle ejecuciones fallidas de Diurno Afore';
    }
  }

  mostrarDetalleDiurnoFondos(data: any): void {
    console.log('mostrarDetalleDiurnoFondos', JSON.parse(JSON.stringify(data)));
    if (!data.extra.fail) {
      this.detalleExito = true;
      this.detalleFallo = false;
      this.tituloGraficoExito = 'Detalle ejecuciones exitosas de Diurno Fondos';
    } else {
      this.detalleExito = false;
      this.detalleFallo = true;
      this.tituloGraficoFallo = 'Detalle ejecuciones fallidas de Diurno Fondos';
    }
  }

  mostrarDetalleNocturnoAfore(data: any): void {
    console.log('mostrarDetalleNocturnoAfore', JSON.parse(JSON.stringify(data)));
    if (!data.extra.fail) {
      this.detalleExito = true;
      this.detalleFallo = false;
      this.tituloGraficoExito = 'Detalle ejecuciones exitosas de Nocturno Afore';
    } else {
      this.detalleExito = false;
      this.detalleFallo = true;
      this.tituloGraficoFallo = 'Detalle ejecuciones fallidas de Nocturno Afore';
    }
  }

  mostrarDetalleNocturnoFondos(data: any): void {
    console.log('mostrarDetalleNocturnoFondos', JSON.parse(JSON.stringify(data)));
    if (!data.extra.fail) {
      this.detalleExito = true;
      this.detalleFallo = false;
      this.tituloGraficoExito = 'Detalle ejecuciones exitosas de Nocturno Fondos';
    } else {
      this.detalleExito = false;
      this.detalleFallo = true;
      this.tituloGraficoFallo = 'Detalle ejecuciones fallidas de Nocturno Fondos';
    }
  }

}
