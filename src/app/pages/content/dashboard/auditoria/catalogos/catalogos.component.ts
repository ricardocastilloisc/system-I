import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadAUDGENUSUARIOS, UnsetAUDGENUSUARIO } from './../../../../../ReduxStore/actions/usuarios/AUDGENUSUARIOS.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Observable, Subscription } from 'rxjs';
import { AUDGENUSUARIO_INTERFACE } from '../../../../../model/AUDGENUSUARIO.model';
import { APIService } from '../../../../../API.service';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { timeStamp } from 'node:console';


@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit {

  itemsAntes = [];
  itemsDespues = [];
  itemsValor = [];

  constructor(
    private store: Store<AppState>,
    private api: APIService,
    private modalService: NgbModal
  ) { }

  AUDGENUSUARIOS$: Observable<AUDGENUSUARIO_INTERFACE[]>;

  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENUSUARIO());
  }

  enProceso(): boolean {
    return false;
  }

  ngOnInit(): void {
    console.log("Entrando a OnInit: Auditoria Catalogos");
    this.AUDGENUSUARIOS$ = this.store.select(
      ({ AUDGENUSUARIOS }) => AUDGENUSUARIOS.AUDGENUSUARIOS
    ).pipe(map(res => {
      if (res === null) return res
      else return res.slice().sort(function (a, b) { return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime() })
    }
    ))

    this.store.select(
      ({ AUDGENUSUARIOS }) => AUDGENUSUARIOS.AUDGENUSUARIOS
    ).subscribe(res => {
      //console.log("Store Select AUDGENUSUARIOS", res) 
    })

    this.store.dispatch(LoadAUDGENUSUARIOS({ consult: { MODULO: 'CATALOGOS' } }));

    this.api.ListAUDGENUSUARIOS('CATALOGOS').then(res => {
      //console.log("Response ListAUDGENUSUARIOS", res)
    })
  }

  openModal(content, objetoDetalle: AUDGENUSUARIO_INTERFACE) {
    this.itemsValor = [];
    this.itemsAntes = [];
    this.itemsDespues = [];

    //console.log("Entrando al modal", objetoDetalle)

    let cambiosAntes = objetoDetalle.CATALOGOS.DETALLE_MODIFICACIONES[0].valorAnterior;
    if (cambiosAntes !== null) {
      cambiosAntes = cambiosAntes.replace('{', '');
      cambiosAntes = cambiosAntes.replace('}', '');
      let arregloAntes = cambiosAntes.split(",");
      let resAntes = [];
      for (let i in arregloAntes) {
        let valor = arregloAntes[i].toString().split("=");
        resAntes.push(valor[1]);
      }
      this.itemsAntes = resAntes;
      //console.log("cambiosAntes", arregloAntes)
    }

    let cambiosDespues = objetoDetalle.CATALOGOS.DETALLE_MODIFICACIONES[0].valorNuevo;
    if (cambiosDespues !== null) {
      cambiosDespues = cambiosDespues.replace('{', '');
      cambiosDespues = cambiosDespues.replace('}', '');
      let arregloDespues = cambiosDespues.split(",");      
      let resDespues = [];
      for (let i in arregloDespues) {
        let valor = arregloDespues[i].toString().split("=");
        resDespues.push(valor[1]);
      }
      this.itemsDespues = resDespues;
      //console.log("cambiosDespues", arregloDespues)
    }

    if (cambiosAntes !== null) {
      let getValor = cambiosAntes.split(",");
      let resultado = [];
      for (let i in getValor) {
        let valor = getValor[i].toString().split("=");
        resultado.push(valor[0]);
      }
      this.itemsValor = resultado;
      //console.log("result", resultado)
    }
    else if (cambiosDespues !== null) {
      let getValor = cambiosDespues.split(",");
      let resultado = [];
      for (let i in getValor) {
        let valor = getValor[i].toString().split("=");
        resultado.push(valor[0]);
      }
      this.itemsValor = resultado;
      //console.log("result", resultado)
    }


    console.log("itemsValor", this.itemsValor)
    console.log("itemsAntes", this.itemsAntes)
    console.log("itemsDespues", this.itemsDespues)

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

}
