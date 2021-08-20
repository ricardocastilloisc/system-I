import { Component, Input, OnInit } from "@angular/core";
import { dataDiccionario } from "../../DiccionarioDeAyuda";

@Component({
    selector: "app-helpers",
    templateUrl: "./helpers.component.html",
    styleUrls: ["./helpers.component.css"],
})
export class HelpersComponent implements OnInit {
    /* parametro  de catalogos donde del elemento de padre*/
    @Input() catalogo: string;

    ArrayDeFilasDeContenido = [];

    hiperVinculos = [];

    tituloDeLaAyuda = ''

    constructor() {
    }

    ngOnInit(): void {

        /* Se hace un hilo de ejecucion la razon muchas veces es mas rapido el render que la ejecucion de pintado  hasta que exista el parametro*/
        new Promise((resolve) => {
            const intervalo = setInterval(() => {
              if (this.catalogo) {
                resolve('ok');
                clearInterval(intervalo);
              }
            }, 100);
          }).then(() => {
              /*Buscamos lo que necesitamos de ayuda*/
            this.ArrayDeFilasDeContenido = dataDiccionario.filter(e =>e.id === this.catalogo)[0].filasAyuda
            this.hiperVinculos = dataDiccionario.filter(e =>e.id === this.catalogo)[0].hiperVinculos
            this.tituloDeLaAyuda = dataDiccionario.filter(e =>e.id === this.catalogo)[0].label
          });

    }
}
