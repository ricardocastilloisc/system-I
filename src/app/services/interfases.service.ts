import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LogeoService } from '../services/logeo.service';

@Injectable({
  providedIn: 'root'
})

export class InterfasesService {

  /* Función para capitalizar una palabra. Ej. hola -> Hola */
  capitalize(word: any): any {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }

  /* Función para cambiar el formato de la fecha. Ej. 2021-08-13 -> 13/08/2021 */
  formatDate(dateString: string): string {
    const thisDate = dateString.split('-');
    const newDate = [thisDate[2], thisDate[1], thisDate[0]].join('/');
    return newDate;
  }

  /* Función para validar que un objeto este vacio, sin propiedades */
  isObjEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }

  constructor(private authService: AuthService, private httpClient: HttpClient, private logeo: LogeoService) { }

  /* Consulta de los datos para los graficos */
  getDatos = async (filtros: any) => {
    try {
      // tslint:disable-next-line: one-variable-per-declaration
      const api = environment.API.endpoints.find((el) => el.name === 'auditoria').endpoint;
      /* configuracion de parametros y headers */
      const params = new URLSearchParams(filtros);
      const url = api + '?' + params.toString();
      const header = new Headers();
      header.append('Authorization', 'Bearer ' + this.authService.getToken());
      const requestOptions = {
        headers: header
      };
      /* llamado al api de estadisticas */
      const res = await fetch(url, requestOptions);
      const data = await res.json();
      return data;
    } catch (e) {
      this.logeo.registrarLog('AUDITORIA', 'CONSULTA INTERFACES', JSON.stringify(e));
    }
  }

  /* Consulta de los problemas detectados */
  getProblemas = async (filtros: any) => {
    try {
      // tslint:disable-next-line: one-variable-per-declaration
      const api = environment.API.endpoints.find((el) => el.name === 'auditoria').endpoint + '/problemas';
      /* configuración de los parámetros y headers */
      const params = new URLSearchParams(filtros);
      const url = api + '?' + params.toString();
      const header = new Headers();
      header.append('Authorization', 'Bearer ' + this.authService.getToken());
      const requestOptions = {
        headers: header
      };
      /* llamado al api de estadisticas */
      const res = await fetch(url, requestOptions);
      let data = await res.json();
      data = data.sort(function (a, b) { return new Date(b.fecha).getTime() - new Date(a.fecha).getTime() });
      return data;
    } catch (e) {
      this.logeo.registrarLog('AUDITORIA', 'CONSULTA PROBLEMAS DETECTADOS', JSON.stringify(e));
    }
  }

  /* Reformato de la consulta de datos de interfaces para formar el json esperado para el grafico de resumen */
  formatoResumen = (data: any): any => {
    if (data) {
      /* definicion de variables */
      let objDiurnos: any;
      let objNocturnos: any;
      const objLimpioDiurnoExitos: any = [];
      const objLimpioDiurnoFallos: any = [];
      const objLimpioDiurnoExitosFondos: any = [];
      const objLimpioDiurnoFallosFondos: any = [];
      const objLimpioNocturnoExitos: any = [];
      const objLimpioNocturnoFallos: any = [];
      const objLimpioNocturnoExitosFondos: any = [];
      const objLimpioNocturnoFallosFondos: any = [];
      if (data.diurnos) {
        /* segmentacion por tipo de proceso diurno */
        objDiurnos = data.diurnos;
        if (objDiurnos.afore) {
          const objAfore = objDiurnos.afore;
          let objProceso: string;
          let objDetalle: {};
          let objLanzamiento: string[];
          let objDetalleInicio: any;
          let sample: any;
          let summed = 0;
          let setName: string;
          // tslint:disable-next-line: forin
          /* segmentacion por negocio afore */
          for (const i in objAfore) {
            objProceso = Object.keys(objAfore[i])[0];
            objDetalle = objAfore[i]['' + objProceso + ''];
            objLanzamiento = Object.keys(objDetalle);
            // tslint:disable-next-line: forin
            for (const j in objLanzamiento) {
              objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              /* segmentacion por procesos exitosos */
              if (objDetalleInicio.exitosos) {
                /* segmentacion por tipo de lanzamiento */
                if (objLanzamiento[j] === 'manual') {
                  setName = 'Manuales';
                } else {
                  setName = 'Automáticos';
                }
                const item = {
                  name: objProceso,
                  children: [
                    { name: setName, size: objDetalleInicio.exitosos }
                  ]
                };
                objLimpioDiurnoExitos.push(item);
              }
              /* segmentacion por procesos fallidos */
              if (objDetalleInicio.fallidos) {
                sample = objDetalleInicio.fallidos;
                summed = 0;
                // tslint:disable-next-line: forin
                for (const key in sample) {
                  summed += sample[key];
                }
                /* segmentacion por tipo de lanzamiento */
                if (objLanzamiento[j] === 'manual') {
                  setName = 'Manuales';
                } else {
                  setName = 'Automáticos';
                }
                const item = {
                  name: objProceso,
                  children: [
                    { name: setName, size: summed }
                  ]
                };
                objLimpioDiurnoFallos.push(item);
              }
            }
          }
        }
        /* segmentacion por negocio fondos */
        if (objDiurnos.fondos) {
          const objFondos = objDiurnos.fondos;
          let objProceso: string;
          let objDetalle: {};
          let objLanzamiento: string[];
          let objDetalleInicio: any;
          let sample: any;
          let summed = 0;
          let setName: string;
          // tslint:disable-next-line: forin
          for (const i in objFondos) {
            objProceso = Object.keys(objFondos[i])[0];
            objDetalle = objFondos[i]['' + objProceso + ''];
            objLanzamiento = Object.keys(objDetalle);
            // tslint:disable-next-line: forin
            for (const j in objLanzamiento) {
              objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              /* segmentacion por procesos exitosos */
              if (objDetalleInicio.exitosos) {
                /* segmentacion por tipo de lanzamiento */
                if (objLanzamiento[j] === 'manual') {
                  setName = 'Manuales';
                } else {
                  setName = 'Automáticos';
                }
                const item = {
                  name: objProceso,
                  children: [
                    { name: setName, size: objDetalleInicio.exitosos }
                  ]
                };
                objLimpioDiurnoExitosFondos.push(item);
              }
              /* segmentacion por procesos fallidos*/
              if (objDetalleInicio.fallidos) {
                sample = objDetalleInicio.fallidos;
                summed = 0;
                // tslint:disable-next-line: forin
                for (const key in sample) {
                  summed += sample[key];
                }
                /* segmentacion por tipo de lanzamiento */
                if (objLanzamiento[j] === 'manual') {
                  setName = 'Manuales';
                } else {
                  setName = 'Automáticos';
                }
                const item = {
                  name: objProceso,
                  children: [
                    { name: setName, size: summed }
                  ]
                };
                objLimpioDiurnoFallosFondos.push(item);
              }
            }
          }
        }
      }
      /* segmentacion para procesos de tipo noctuno */
      if (data.nocturnos) {
        objNocturnos = data.nocturnos;
        /* segmentacion por tipo de negocio afore */
        if (objNocturnos.afore) {
          const objAfore = objNocturnos.afore;
          let objProceso: string;
          let objDetalle: {};
          let objLanzamiento: string[];
          let objDetalleInicio: any;
          let sample: any;
          let summed = 0;
          let setName: string;
          // tslint:disable-next-line: forin
          for (const i in objAfore) {
            objProceso = Object.keys(objAfore[i])[0];
            objDetalle = objAfore[i]['' + objProceso + ''];
            objLanzamiento = Object.keys(objDetalle);
            // tslint:disable-next-line: forin
            for (const j in objLanzamiento) {
              objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              /* segmentacion por procesos exitosos*/
              if (objDetalleInicio.exitosos) {
                /* segmentacion por tipo de lanzamiento */
                if (objLanzamiento[j] === 'manual') {
                  setName = 'Manuales';
                } else {
                  setName = 'Automáticos';
                }
                const item = {
                  name: objProceso,
                  children: [
                    { name: setName, size: objDetalleInicio.exitosos }
                  ]
                };
                objLimpioNocturnoExitos.push(item);
              }
              /* segmentacion por procesos fallidos */
              if (objDetalleInicio.fallidos) {
                sample = objDetalleInicio.fallidos;
                summed = 0;
                // tslint:disable-next-line: forin
                for (const key in sample) {
                  summed += sample[key];
                }
                /* segmentacion por tipo de lanzamiento */
                if (objLanzamiento[j] === 'manual') {
                  setName = 'Manuales';
                } else {
                  setName = 'Automáticos';
                }
                const item = {
                  name: objProceso,
                  children: [
                    { name: setName, size: summed }
                  ]
                };
                objLimpioNocturnoFallos.push(item);
              }
            }
          }
        }
        /* segmentacion por negocio fondos */
        if (objNocturnos.fondos) {
          const objFondos = objNocturnos.fondos;
          let objProceso: string;
          let objDetalle: {};
          let objLanzamiento: string[];
          let objDetalleInicio: any;
          let sample: any;
          let summed = 0;
          let setName: string;
          // tslint:disable-next-line: forin
          for (const i in objFondos) {
            objProceso = Object.keys(objFondos[i])[0];
            objDetalle = objFondos[i]['' + objProceso + ''];
            objLanzamiento = Object.keys(objDetalle);
            // tslint:disable-next-line: forin
            for (const j in objLanzamiento) {
              objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              /* segmentacion por procesos exitosos */
              if (objDetalleInicio.exitosos) {
                /* segmentacion por tipo de lanzamiento */
                if (objLanzamiento[j] === 'manual') {
                  setName = 'Manuales';
                } else {
                  setName = 'Automáticos';
                }
                const item = {
                  name: objProceso,
                  children: [
                    { name: setName, size: objDetalleInicio.exitosos }
                  ]
                };
                objLimpioNocturnoExitosFondos.push(item);
              }
              /* segmentacion por procesos fallidos */
              if (objDetalleInicio.fallidos) {
                sample = objDetalleInicio.fallidos;
                summed = 0;
                // tslint:disable-next-line: forin
                for (const key in sample) {
                  summed += sample[key];
                }
                /* segmentacion por tipo de lanzamiento */
                if (objLanzamiento[j] === 'manual') {
                  setName = 'Manuales';
                } else {
                  setName = 'Automáticos';
                }
                const item = {
                  name: objProceso,
                  children: [
                    { name: setName, size: summed }
                  ]
                };
                objLimpioNocturnoFallosFondos.push(item);
              }
            }
          }
        }
      }
      /* generacion del response */
      const response = [
        {
          name: 'Ejecuciones',
          children: [
            {
              name: 'Diurnos',
              children: [
                {
                  name: 'Afore',
                  children: [
                    {
                      name: 'Exitosos',
                      children: objLimpioDiurnoExitos
                    },
                    {
                      name: 'Fallidos',
                      children: objLimpioDiurnoFallos
                    }]
                },
                {
                  name: 'Fondos',
                  children: [
                    {
                      name: 'Exitosos',
                      children: objLimpioDiurnoExitosFondos
                    },
                    {
                      name: 'Fallidos',
                      children: objLimpioDiurnoFallosFondos
                    }]
                }]
            },
            {
              name: 'Nocturnos',
              children: [
                {
                  name: 'Afore',
                  children: [
                    {
                      name: 'Exitosos',
                      children: objLimpioNocturnoExitos
                    },
                    {
                      name: 'Fallidos',
                      children: objLimpioNocturnoFallos
                    }]
                },
                {
                  name: 'Fondos',
                  children: [
                    {
                      name: 'Exitosos',
                      children: objLimpioNocturnoExitosFondos
                    },
                    {
                      name: 'Fallidos',
                      children: objLimpioNocturnoFallosFondos
                    }]
                }]
            }]
        }];
      return response;
    }
  }

  /* Reformato de la consulta de datos de interfaces para formar el json esperado para el grafico de barras horizontales de negocio */
  formatoDatosBarHorNegocio = (data: any, tipo: string): any => {
    if (data) {
      /* declaracion de variables */
      let response: any;
      let objAfore: any;
      let objFondos: any;
      let sumAfore = 0;
      let sumFondos = 0;
      const obj = data['' + tipo + ''];
      if (obj) {
        /* segmentacion por negocio afore */
        if (obj.afore) {
          objAfore = obj.afore;
          for (const i in objAfore) {
            const objProceso = Object.keys(objAfore[i])[0];
            const objDetalle = objAfore[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            // tslint:disable-next-line: forin
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                sumAfore += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                // tslint:disable-next-line: forin
                for (const key in objDetalleInicio.fallidos) {
                  sumAfore += objDetalleInicio.fallidos[key];
                }
              }
            }
          }
        }
        /* segmentacion por negocio fondos */
        if (obj.fondos) {
          objFondos = obj.fondos;
          for (const i in objFondos) {
            const objProceso = Object.keys(objFondos[i])[0];
            const objDetalle = objFondos[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            // tslint:disable-next-line: forin
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                sumFondos += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                // tslint:disable-next-line: forin
                for (const key in objDetalleInicio.fallidos) {
                  sumFondos += objDetalleInicio.fallidos[key];
                }
              }
            }
          }
        }
        objAfore = {
          name: 'Afore',
          value: sumAfore
        };
        objFondos = {
          name: 'Fondos',
          value: sumFondos
        };
        /* generacion del response */
        response = [
          objAfore,
          objFondos
        ];
        return response;
      }
    }
  }

  /* Reformato de la consulta de datos de interfaces para formar el json esperado para el grafico de barras horizontales de tipos de lanzamientos */
  formatoDatosBarHorLanzamiento = (data: any, tipo: string): any => {
    if (data) {
      /* declaracion de variables */
      let response: any;
      let objManual: any;
      let objAuto: any;
      let summedMan = 0;
      let summedAuto = 0;
      const obj = data['' + tipo + ''];
      if (obj) {
        /* segmentacion por negocio afore */
        if (obj.afore) {
          const objAfore = obj.afore;
          let objProceso: string;
          let objDetalle: {};
          let objLanzamiento: string[];
          let objDetalleInicio: any;
          let sample: any;
          // tslint:disable-next-line: forin
          for (const i in objAfore) {
            objProceso = Object.keys(objAfore[i])[0];
            objDetalle = objAfore[i]['' + objProceso + ''];
            objLanzamiento = Object.keys(objDetalle);
            // tslint:disable-next-line: forin
            for (const j in objLanzamiento) {
              objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objLanzamiento[j] === 'manual') {
                if (objDetalleInicio.exitosos) {
                  summedMan += objDetalleInicio.exitosos;
                }
                if (objDetalleInicio.fallidos) {
                  sample = objDetalleInicio.fallidos;
                  // tslint:disable-next-line: forin
                  for (const key in sample) {
                    summedMan += sample[key];
                  }
                }
              } else {
                if (objDetalleInicio.exitosos) {
                  summedAuto += objDetalleInicio.exitosos;
                }
                if (objDetalleInicio.fallidos) {
                  sample = objDetalleInicio.fallidos;
                  // tslint:disable-next-line: forin
                  for (const key in sample) {
                    summedAuto += sample[key];
                  }
                }
              }
            }
          }
        }
        /* segmentacion por negocio fondos */
        if (obj.fondos) {
          const objFondos = obj.fondos;
          let objProceso: string;
          let objDetalle: {};
          let objLanzamiento: string[];
          let objDetalleInicio: any;
          let sample: any;
          // tslint:disable-next-line: forin
          for (const i in objFondos) {
            objProceso = Object.keys(objFondos[i])[0];
            objDetalle = objFondos[i]['' + objProceso + ''];
            objLanzamiento = Object.keys(objDetalle);
            // tslint:disable-next-line: forin
            for (const j in objLanzamiento) {
              objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objLanzamiento[j] === 'manual') {
                if (objDetalleInicio.exitosos) {
                  summedMan += objDetalleInicio.exitosos;
                }
                if (objDetalleInicio.fallidos) {
                  sample = objDetalleInicio.fallidos;
                  // tslint:disable-next-line: forin
                  for (const key in sample) {
                    summedMan += sample[key];
                  }
                }
              } else {
                if (objDetalleInicio.exitosos) {
                  summedAuto += objDetalleInicio.exitosos;
                }
                if (objDetalleInicio.fallidos) {
                  sample = objDetalleInicio.fallidos;
                  // tslint:disable-next-line: forin
                  for (const key in sample) {
                    summedAuto += sample[key];
                  }
                }
              }
            }
          }
        }
      }
      objManual = {
        name: 'Manual',
        value: summedMan
      };
      objAuto = {
        name: 'Automático',
        value: summedAuto
      };
      /* generacion del response */
      response = [
        objManual,
        objAuto
      ];
      return response;
    }
  }

  /* Reformato de la consulta de datos de interfaces para formar el json esperado para el grafico de pie */
  formatoDatosPie = (data: any, tipo: string, negocio: string): any => {
    if (data) {
      /* declaracion de variables */
      let response: any;
      let objExito: any;
      let objFallo: any;
      let summedExito = 0;
      let summedFallo = 0;
      const obj = data['' + tipo + ''];
      if (obj) {
        const objNegocio = obj['' + negocio + ''];
        if (objNegocio) {
          const objAfore = objNegocio;
          let objProceso: string;
          let objDetalle: {};
          let objLanzamiento: string[];
          let objDetalleInicio: any;
          let sample: any;
          // tslint:disable-next-line: forin
          for (const i in objAfore) {
            objProceso = Object.keys(objAfore[i])[0];
            objDetalle = objAfore[i]['' + objProceso + ''];
            objLanzamiento = Object.keys(objDetalle);
            // tslint:disable-next-line: forin
            for (const j in objLanzamiento) {
              objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                summedExito += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                sample = objDetalleInicio.fallidos;
                // tslint:disable-next-line: forin
                for (const key in sample) {
                  summedFallo += sample[key];
                }
              }
            }
          }
        }
      }
      objExito = {
        name: 'Exitoso',
        value: summedExito
      };
      objFallo = {
        name: 'Fallidos',
        value: summedFallo
      };
      /* generacion del response */
      response = [
        objExito,
        objFallo
      ];
      return response;
    }
  }

  /* Reformato de la consulta de datos de interfaces para formar el json esperado para el grafico de barras verticales */
  formatoDatosBarDetalle = (data: any, tipo: string, negocio: string, estado: string): any => {
    tipo = tipo.toLowerCase();
    negocio = negocio.toLowerCase();
    estado = estado.toLowerCase();
    if (data) {
      const response: any = [];
      const obj = data['' + tipo + ''];
      if (obj) {
        const objNegocio = obj['' + negocio + ''];
        if (objNegocio) {
          let objProceso: string;
          let objDetalle: {};
          let objLanzamiento: string[];
          let objDetalleInicio: any;
          // tslint:disable-next-line: forin
          for (const i in objNegocio) {
            objProceso = Object.keys(objNegocio[i])[0];
            objDetalle = objNegocio[i]['' + objProceso + ''];
            objLanzamiento = Object.keys(objDetalle);
            // tslint:disable-next-line: forin
            for (const j in objLanzamiento) {
              objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos && estado.includes('exito')) {
                const item = {
                  name: objProceso,
                  value: objDetalleInicio.exitosos
                };
                response.push(item);
              }
              if (objDetalleInicio.fallidos && !estado.includes('exito')) {
                const sample = objDetalleInicio.fallidos;
                let summed = 0;
                // tslint:disable-next-line: forin
                for (const key in sample) {
                  summed += sample[key];
                }
                const item = {
                  name: objProceso,
                  value: summed
                };
                response.push(item);
              }
            }
          }
        }
      }
      return response;
    }
  }

  /*
  Funcion para dar formato a los datos del reporte mensual para visualizar en la tabla de resumen
  Datos de entrada:
    {
    "diurnos": {
      "fondos": [{
        "MANDATOS": {
          "manual": {
            "exitosos": 38,
            "fallidos": {
              "BRS": 1,
              "PIP": 0,
              "TI": 40,
              "Usuario": 0
            }
          }
        }
      }]
    }
  }
  Datos de alida:
    ['MANDATOS', '38', '41']
  */
  formatoDatosReporteMensual(datos: any) {
    let datosFormateados: any = [];
    // asignacion del header
    const titulo = [
      { text: 'Interfaz', bold: true },
      { text: '# ejecuciones exitosas', bold: true },
      { text: '# ejecuciones fallidas', bold: true },
    ];
    datosFormateados.push(titulo);
    // validacion para ejecutar solo si hay datos
    if (this.isObjEmpty(datos) === false) {
      // validacion de existencia de procesos diurnos
      if (datos.hasOwnProperty('diurnos')) {
        // validacion de procesos por negocio afore
        if (datos.diurnos.hasOwnProperty('afore')) {
          const objAfore = datos.diurnos.afore;
          for (let i in objAfore) {
            const objProceso = Object.keys(objAfore[i])[0];
            const objDetalle = objAfore[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            let sumAforeExito = 0;
            let sumAforeFallo = 0;
            // realizar conteo de ejecuciones
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                sumAforeExito += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                for (const key in objDetalleInicio.fallidos) {
                  sumAforeFallo += objDetalleInicio.fallidos[key];
                }
              }
              // generacion de atributo para añadir a la lista
              const item = [
                objProceso,
                sumAforeExito,
                sumAforeFallo,
              ];
              datosFormateados.push(item);
            }
          }
        }
        // validacion para negocio fondos
        if (datos.diurnos.hasOwnProperty('fondos')) {
          const objFondos = datos.diurnos.fondos;
          for (let i in objFondos) {
            const objProceso = Object.keys(objFondos[i])[0];
            const objDetalle = objFondos[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            let sumAforeExito = 0;
            let sumAforeFallo = 0;
            // realizar conteo de ejecuciones
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                sumAforeExito += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                for (const key in objDetalleInicio.fallidos) {
                  sumAforeFallo += objDetalleInicio.fallidos[key];
                }
              }
              // generacion de item para añadir a la lista de ejecuciones
              const item = [
                objProceso,
                sumAforeExito,
                sumAforeFallo,
              ];
              datosFormateados.push(item);
            }
          }
        }
      }
      // validacion para procesos nocturnos
      if (datos.hasOwnProperty('nocturnos')) {
        // validacion existencia procesos de negocio afore
        if (datos.nocturnos.hasOwnProperty('afore')) {
          const objAfore = datos.nocturnos.afore;
          for (let i in objAfore) {
            const objProceso = Object.keys(objAfore[i])[0];
            const objDetalle = objAfore[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            let sumAforeExito = 0;
            let sumAforeFallo = 0;
            // conteo de ejecuciones
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                sumAforeExito += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                for (const key in objDetalleInicio.fallidos) {
                  sumAforeFallo += objDetalleInicio.fallidos[key];
                }
              }
              // agregar resumen a la respuesta
              const item = [
                objProceso,
                sumAforeExito,
                sumAforeFallo,
              ];
              datosFormateados.push(item);
            }
          }
        }
        // validacion de ejecuciones para negocio fondos
        if (datos.nocturnos.hasOwnProperty('fondos')) {
          const objFondos = datos.nocturnos.fondos;
          for (let i in objFondos) {
            const objProceso = Object.keys(objFondos[i])[0];
            const objDetalle = objFondos[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            let sumAforeExito = 0;
            let sumAforeFallo = 0;
            // conteo de ejeuciones
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                sumAforeExito += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                for (const key in objDetalleInicio.fallidos) {
                  sumAforeFallo += objDetalleInicio.fallidos[key];
                }
              }
              // agregar resumen de las ejecuciones
              const item = [
                objProceso,
                sumAforeExito,
                sumAforeFallo,
              ];
              datosFormateados.push(item);
            }
          }
        }
      }
    }
    return datosFormateados;
  }

  /*
  Funcion para dar formato a la estructura de la grafica del reporte mensual
  Datos de entrada:
  {
    "diurnos": {
      "fondos": [{
        "MANDATOS": {
          "manual": {
            "exitosos": 38,
            "fallidos": {
              "BRS": 1,
              "PIP": 0,
              "TI": 40,
              "Usuario": 0
            }
          }
        }
      }]
    }
  }
  Datos de salida:
    [
      {
        "name": "Germany",
        "series": [
          {
            "name": "2010",
            "value": 7300000
          },
          {
            "name": "2011",
            "value": 8940000
          }
        ]
      }
    ]
   */
  formatoGraficaMensual(datos: any): any {
    let response;
    let sumaDiurnoExito = 0;
    let sumaDiurnoFallo = 0;
    let sumaNocturnoExito = 0;
    let sumaNocturnoFallo = 0;
    // validacion existencia de datos
    if (this.isObjEmpty(datos) === false) {
      // validacion de existencia de procesos diurnos
      if (datos.hasOwnProperty('diurnos')) {
        // validacion de existencia de procesos de afore
        if (datos.diurnos.hasOwnProperty('afore')) {
          const objAfore = datos.diurnos.afore;
          for (let i in objAfore) {
            const objProceso = Object.keys(objAfore[i])[0];
            const objDetalle = objAfore[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            // conteo de las ejecuciones
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                sumaDiurnoExito += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                for (const key in objDetalleInicio.fallidos) {
                  sumaDiurnoFallo += objDetalleInicio.fallidos[key];
                }
              }
            }
          }
        }
        // validacion de existencia de procesos de fondos
        if (datos.diurnos.hasOwnProperty('fondos')) {
          const objFondos = datos.diurnos.fondos;
          for (let i in objFondos) {
            const objProceso = Object.keys(objFondos[i])[0];
            const objDetalle = objFondos[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            // conteo de las ejecuciones por exito o fallo
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                sumaDiurnoExito += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                for (const key in objDetalleInicio.fallidos) {
                  sumaDiurnoFallo += objDetalleInicio.fallidos[key];
                }
              }
            }
          }
        }
      }
      // validacion de existencia de procesos de noctrnos
      if (datos.hasOwnProperty('nocturnos')) {
        // validacion de existencia de procesos nocturnos de afore
        if (datos.nocturnos.hasOwnProperty('afore')) {
          const objAfore = datos.nocturnos.afore;
          for (let i in objAfore) {
            const objProceso = Object.keys(objAfore[i])[0];
            const objDetalle = objAfore[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            // conteo de las ejecuciones
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                sumaNocturnoExito += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                for (const key in objDetalleInicio.fallidos) {
                  sumaNocturnoFallo += objDetalleInicio.fallidos[key];
                }
              }
            }
          }
        }
        // validacion de existencia de procesos nocturnos de fondos
        if (datos.nocturnos.hasOwnProperty('fondos')) {
          const objFondos = datos.nocturnos.fondos;
          for (let i in objFondos) {
            const objProceso = Object.keys(objFondos[i])[0];
            const objDetalle = objFondos[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            // conteo de las ejecuciones
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                sumaNocturnoExito += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                for (const key in objDetalleInicio.fallidos) {
                  sumaNocturnoFallo += objDetalleInicio.fallidos[key];
                }
              }
            }
          }
        }
      }
    }
    // generacion del resumen de las ejecuciones
    response = [
      {
        "name": "Diurnos",
        "series": [
          {
            "name": "Exitosos",
            "value": sumaDiurnoExito
          },
          {
            "name": "Fallidos",
            "value": sumaDiurnoFallo
          }
        ]
      },
      {
        "name": "Nocturnos",
        "series": [
          {
            "name": "Exitosos",
            "value": sumaNocturnoExito
          },
          {
            "name": "Fallidos",
            "value": sumaNocturnoFallo
          }
        ]
      },
    ];
    return response
  }

  /*
 Funcion para dar formato a la estructura de la grafica del reporte mensual
 Datos de entrada:
  {
    "diurnos": {
      "fondos": [{
        "MANDATOS": {
          "manual": {
            "exitosos": 38,
            "fallidos": {
              "BRS": 1,
              "PIP": 0,
              "TI": 40,
              "Usuario": 0
            }
          }
        }
      }]
    }
  }
  Datos de salida:
  {
      "diurnoAforeExito": 84,
      "diurnoAforeFallo": 300,
      "diurnoAforeTotal": 384,
      "diurnoFondosExito": 33,
      "diurnoFondosFallo": 366,
      "diurnoFondosTotal": 399,
      "nocturnoAforeExito": 0,
      "nocturnoAforeFallo": 0,
      "nocturnoAforeTotal": 0,
      "nocturnoFondosExito": 0,
      "nocturnoFondosFallo": 0,
      "nocturnoFondosTotal": 0
  }
  */
  resumenGraficoMensual(datos: any): any {
    let response;
    let diurnoAforeExito = 0;
    let diurnoAforeFallo = 0;
    let diurnoFondosExito = 0;
    let diurnoFondosFallo = 0;
    let nocturnoAforeExito = 0;
    let nocturnoAforeFallo = 0;
    let nocturnoFondosExito = 0;
    let nocturnoFondosFallo = 0;
    // validacion de existencia de datos
    if (this.isObjEmpty(datos) === false) {
      // validacion existencia procesos diurnos
      if (datos.hasOwnProperty('diurnos')) {
        // validacion existencia procesos diurnos negocio afore
        if (datos.diurnos.hasOwnProperty('afore')) {
          const objAfore = datos.diurnos.afore;
          for (let i in objAfore) {
            const objProceso = Object.keys(objAfore[i])[0];
            const objDetalle = objAfore[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            // conteo de ejecuciones exitosas y fallidas
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                diurnoAforeExito += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                for (const key in objDetalleInicio.fallidos) {
                  diurnoAforeFallo += objDetalleInicio.fallidos[key];
                }
              }
            }
          }
        }
        // validacion existencia procesos diurnos para fondos
        if (datos.diurnos.hasOwnProperty('fondos')) {
          const objFondos = datos.diurnos.fondos;
          for (let i in objFondos) {
            const objProceso = Object.keys(objFondos[i])[0];
            const objDetalle = objFondos[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            // conte de ejecuciones exitosas y fallidas
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                diurnoFondosExito += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                for (const key in objDetalleInicio.fallidos) {
                  diurnoFondosFallo += objDetalleInicio.fallidos[key];
                }
              }
            }
          }
        }
      }
      // validacion existencia procesos nocturnos
      if (datos.hasOwnProperty('nocturnos')) {
        // validacion existencia procesos nocturnos de afore
        if (datos.nocturnos.hasOwnProperty('afore')) {
          const objAfore = datos.nocturnos.afore;
          for (let i in objAfore) {
            const objProceso = Object.keys(objAfore[i])[0];
            const objDetalle = objAfore[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            // conteo de ejecuciones
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                nocturnoAforeExito += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                for (const key in objDetalleInicio.fallidos) {
                  nocturnoAforeFallo += objDetalleInicio.fallidos[key];
                }
              }
            }
          }
        }
        // validacion existencia procesos nocturnos para fondos
        if (datos.nocturnos.hasOwnProperty('fondos')) {
          const objFondos = datos.nocturnos.fondos;
          for (let i in objFondos) {
            const objProceso = Object.keys(objFondos[i])[0];
            const objDetalle = objFondos[i]['' + objProceso + ''];
            const objLanzamiento = Object.keys(objDetalle);
            // conteo de ejeuciones exitosas y fallidas
            for (const j in objLanzamiento) {
              const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
                nocturnoFondosExito += objDetalleInicio.exitosos;
              }
              if (objDetalleInicio.fallidos) {
                for (const key in objDetalleInicio.fallidos) {
                  nocturnoFondosFallo += objDetalleInicio.fallidos[key];
                }
              }
            }
          }
        }
      }
    }
    // generacion del resumen como respuesta
    response = {
      diurnoAforeExito: diurnoAforeExito,
      diurnoAforeFallo: diurnoAforeFallo,
      diurnoAforeTotal: diurnoAforeExito + diurnoAforeFallo,
      diurnoFondosExito: diurnoFondosExito,
      diurnoFondosFallo: diurnoFondosFallo,
      diurnoFondosTotal: diurnoFondosExito + diurnoFondosFallo,
      nocturnoAforeExito: nocturnoAforeExito,
      nocturnoAforeFallo: nocturnoAforeFallo,
      nocturnoAforeTotal: nocturnoAforeExito + nocturnoAforeFallo,
      nocturnoFondosExito: nocturnoFondosExito,
      nocturnoFondosFallo: nocturnoFondosFallo,
      nocturnoFondosTotal: nocturnoFondosExito + nocturnoFondosFallo,
    };
    return response
  }

  /* Funcion que se encarga de obtener los datos anuales para generar el reporte
  Datos de entrada:
  meses:
    [
      {
          "id": "01",
          "numero": 1,
          "descripcion": "Enero",
          "dias": 31
      },
      {
          "id": "02",
          "numero": 2,
          "descripcion": "Febrero",
          "dias": 29
      },
      {
          "id": "03",
          "numero": 3,
          "descripcion": "Marzo",
          "dias": 31
      },
      {
          "id": "04",
          "numero": 4,
          "descripcion": "Abril",
          "dias": 30
      },
      {
          "id": "05",
          "numero": 5,
          "descripcion": "Mayo",
          "dias": 31
      },
      {
          "id": "06",
          "numero": 6,
          "descripcion": "Junio",
          "dias": 30
      },
      {
          "id": "07",
          "numero": 7,
          "descripcion": "Julio",
          "dias": 31
      },
      {
          "id": "08",
          "numero": 8,
          "descripcion": "Agosto",
          "dias": 31
      },
      {
          "id": "09",
          "numero": 9,
          "descripcion": "Septiembre",
          "dias": 30
      },
      {
          "id": "10",
          "numero": 10,
          "descripcion": "Octubre",
          "dias": 31
      },
      {
          "id": "11",
          "numero": 11,
          "descripcion": "Noviembre",
          "dias": 30
      },
      {
          "id": "12",
          "numero": 12,
          "descripcion": "Diciembre",
          "dias": 31
      }
  ]
  mesReporte: 02
  Datos de salida:
    	[{
			"diurnos": {
				{
					"afore": [{
						"MO": {
							"manual": {
								"fallidos": {
									"BRS": 0,
									"PIP": 0,
									"TI": 23,
									"Usuario": 0
								},
								"exitosos": 9
							}
						}
					}]
				},
				"fecha_inicio": "2021-08-01"
			},
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{}
		]
  */
  obtenerDatosAnuales = async (meses: any, mesReporte) => {
    try {
      const dias = meses.filter(element => element.id === mesReporte);
      const dia = dias[0].dias;
      const anio = new Date().getFullYear();
      const api = environment.API.endpoints.find((el) => el.name === 'auditoria').endpoint;
      const token = this.authService.getToken();
      const header = new Headers();
      header.append('Authorization', 'Bearer ' + token);
      const requestOptions = {
        headers: header
      };
      let filtro1 = {
        fecha_inicio: anio + '-' + mesReporte + '-01',
        fecha_fin: anio + '-' + mesReporte + '-' + dia
      };
      let filtro2 = this.obtenerMesAnterior(filtro1.fecha_inicio, meses);
      let filtro3 = this.obtenerMesAnterior(filtro2.fecha_inicio, meses);
      let filtro4 = this.obtenerMesAnterior(filtro3.fecha_inicio, meses);
      let filtro5 = this.obtenerMesAnterior(filtro4.fecha_inicio, meses);
      let filtro6 = this.obtenerMesAnterior(filtro5.fecha_inicio, meses);
      let filtro7 = this.obtenerMesAnterior(filtro6.fecha_inicio, meses);
      let filtro8 = this.obtenerMesAnterior(filtro7.fecha_inicio, meses);
      let filtro9 = this.obtenerMesAnterior(filtro8.fecha_inicio, meses);
      let filtro10 = this.obtenerMesAnterior(filtro9.fecha_inicio, meses);
      let filtro11 = this.obtenerMesAnterior(filtro10.fecha_inicio, meses);
      let filtro12 = this.obtenerMesAnterior(filtro11.fecha_inicio, meses);
      const params1 = new URLSearchParams(filtro1);
      const url1 = api + '?' + params1.toString();
      const params2 = new URLSearchParams(filtro2);
      const url2 = api + '?' + params2.toString();
      const params3 = new URLSearchParams(filtro3);
      const url3 = api + '?' + params3.toString();
      const params4 = new URLSearchParams(filtro4);
      const url4 = api + '?' + params4.toString();
      const params5 = new URLSearchParams(filtro5);
      const url5 = api + '?' + params5.toString();
      const params6 = new URLSearchParams(filtro6);
      const url6 = api + '?' + params6.toString();
      const params7 = new URLSearchParams(filtro7);
      const url7 = api + '?' + params7.toString();
      const params8 = new URLSearchParams(filtro8);
      const url8 = api + '?' + params8.toString();
      const params9 = new URLSearchParams(filtro9);
      const url9 = api + '?' + params9.toString();
      const params10 = new URLSearchParams(filtro10);
      const url10 = api + '?' + params10.toString();
      const params11 = new URLSearchParams(filtro11);
      const url11 = api + '?' + params11.toString();
      const params12 = new URLSearchParams(filtro12);
      const url12 = api + '?' + params12.toString();
      const results = await Promise.all([
        fetch(url1, requestOptions),
        fetch(url2, requestOptions),
        fetch(url3, requestOptions),
        fetch(url4, requestOptions),
        fetch(url5, requestOptions),
        fetch(url6, requestOptions),
        fetch(url7, requestOptions),
        fetch(url7, requestOptions),
        fetch(url8, requestOptions),
        fetch(url9, requestOptions),
        fetch(url10, requestOptions),
        fetch(url11, requestOptions),
        fetch(url12, requestOptions)
      ]);
      const dataPromise = results.map(result => result.json());
      const response = await Promise.all(dataPromise);
      return response
    } catch (e) {
      this.logeo.registrarLog('AUDITORIA', 'CONSULTA INTERFACES ANUAL', JSON.stringify(e));
    }

  }

  /*
  Funcion para obtener el mes anterior a la fecha de entrada
  Entrada: 2020-08-10
  Salida: 2020-07-10
  */
  obtenerMesAnterior(fecha: string, meses: any): any {
    try {
      let fechaInicial = new Date(fecha);
      // formato a la fecha para que sea local
      fechaInicial.setTime(fechaInicial.getTime() + fechaInicial.getTimezoneOffset() * 60 * 1000);
      // generacion de calculo
      let dias = 1000 * 60 * 60 * 24 * 30;
      // restar mes a la fecha
      let resta = fechaInicial.getTime() - dias;
      let fechaAnterior = new Date(resta);
      let anio = fechaAnterior.getFullYear();
      let mes = fechaAnterior.getMonth() + 1;
      let mesString = mes.toString();
      if (mesString.length < 2) {
        mesString = '0' + mesString;
      }
      const diaMes = meses.filter(element => element.id === mesString);
      const dia = diaMes[0].dias;
      // generacion de filtro con la nueva fecha
      let nuevoFiltro = {
        fecha_inicio: anio + '-' + mesString + '-01',
        fecha_fin: anio + '-' + mesString + '-' + dia
      };
      return nuevoFiltro
    } catch (e) {
      this.logeo.registrarLog('AUDITORIA', 'CONSULTA INTERFACES ANUAL', JSON.stringify(e));
    }
  }

  /* Funcion para obtener el mes de una fecha */
  obtenerMes(fecha: string) {
    let response = fecha.substring(5, 7);
    return response
  }
  /* Funcion para obtener el mes de una fecha */
  obtenerAnio(fecha: string) {
    let response = fecha.substring(0, 4);
    return response
  }

  /* Funcion para obtener la estrcutura para el grafico del reporte anual
  Datos de entrada:
  meses:
    [
      {
          "id": "01",
          "numero": 1,
          "descripcion": "Enero",
          "dias": 31
      },
      {
          "id": "02",
          "numero": 2,
          "descripcion": "Febrero",
          "dias": 29
      },
      {
          "id": "03",
          "numero": 3,
          "descripcion": "Marzo",
          "dias": 31
      },
      {
          "id": "04",
          "numero": 4,
          "descripcion": "Abril",
          "dias": 30
      },
      {
          "id": "05",
          "numero": 5,
          "descripcion": "Mayo",
          "dias": 31
      },
      {
          "id": "06",
          "numero": 6,
          "descripcion": "Junio",
          "dias": 30
      },
      {
          "id": "07",
          "numero": 7,
          "descripcion": "Julio",
          "dias": 31
      },
      {
          "id": "08",
          "numero": 8,
          "descripcion": "Agosto",
          "dias": 31
      },
      {
          "id": "09",
          "numero": 9,
          "descripcion": "Septiembre",
          "dias": 30
      },
      {
          "id": "10",
          "numero": 10,
          "descripcion": "Octubre",
          "dias": 31
      },
      {
          "id": "11",
          "numero": 11,
          "descripcion": "Noviembre",
          "dias": 30
      },
      {
          "id": "12",
          "numero": 12,
          "descripcion": "Diciembre",
          "dias": 31
      }
  ]
  datos:
    [
    {},
    {
        "diurnos": {
            "fondos": [
                {
                    "CRD": {
                        "manual": {
                            "exitosos": 32,
                            "fallidos": {
                                "BRS": 0,
                                "PIP": 0,
                                "TI": 13,
                                "Usuario": 0
                            }
                        }
                    }
                },
            ],
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {}
]
  Datos de salida:
    [
        {
            "name": "Diurnos",
            "series": [
                {
                    "name": "Agosto 2021",
                    "value": 783
                },
                {
                    "name": "Julio 2021",
                    "value": 554
                },
                {
                    "name": "Junio 2021",
                    "value": 176
                }
            ]
        },
        {
            "name": "Nocturnos",
            "series": []
        }
    ]
  */
  formatoGraficaAnual(datos: any, meses: any): any {
    if (this.isObjEmpty(datos) === false) {
      let mesActual;
      let anioActual;
      let fechaDescripcion;
      let dias;
      let itemsDiurnos = [];
      let itemsNocturnos = [];
      for (let i in datos) {
        if (this.isObjEmpty(datos[i]) === false) {
          if (datos[i].hasOwnProperty('fecha_inicio')) {
            let sumaDiurnoExito = 0;
            let sumaDiurnoFallo = 0;
            let sumaNocturnoExito = 0;
            let sumaNocturnoFallo = 0;
            // generar descripcion de la fecha en formato 'Agosto 2021'
            mesActual = this.obtenerMes(datos[i].fecha_inicio);
            anioActual = this.obtenerAnio(datos[i].fecha_inicio);
            dias = meses.filter(element => element.id === mesActual);
            fechaDescripcion = dias[0].descripcion + ' ' + anioActual;
            if (datos[i].hasOwnProperty('diurnos')) {
              // trae datos para procesos diurnos
              if (datos[i].diurnos.hasOwnProperty('afore')) {
                // trae datos para procesos diurnos de afore
                const objAfore = datos[i].diurnos.afore;
                for (let i in objAfore) {
                  const objProceso = Object.keys(objAfore[i])[0];
                  const objDetalle = objAfore[i]['' + objProceso + ''];
                  const objLanzamiento = Object.keys(objDetalle);
                  // conteo de ejeuciones exitosas y fallidas
                  for (const j in objLanzamiento) {
                    const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
                    if (objDetalleInicio.exitosos) {
                      sumaDiurnoExito += objDetalleInicio.exitosos;
                    }
                    if (objDetalleInicio.fallidos) {
                      for (const key in objDetalleInicio.fallidos) {
                        sumaDiurnoFallo += objDetalleInicio.fallidos[key];
                      }
                    }
                  }
                }
              }
              // validacion para procesos de fondos
              if (datos[i].diurnos.hasOwnProperty('fondos')) {
                // trae datos para procesos diurnos de fondos
                const objFondos = datos[i].diurnos.fondos;
                for (let i in objFondos) {
                  const objProceso = Object.keys(objFondos[i])[0];
                  const objDetalle = objFondos[i]['' + objProceso + ''];
                  const objLanzamiento = Object.keys(objDetalle);
                  for (const j in objLanzamiento) {
                    const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
                    if (objDetalleInicio.exitosos) {
                      sumaDiurnoExito += objDetalleInicio.exitosos;
                    }
                    if (objDetalleInicio.fallidos) {
                      for (const key in objDetalleInicio.fallidos) {
                        sumaDiurnoFallo += objDetalleInicio.fallidos[key];
                      }
                    }
                  }
                }
              }
              // añadir resumen a la respuesta
              const item = {
                name: fechaDescripcion,
                value: sumaDiurnoExito + sumaDiurnoFallo
              };
              itemsDiurnos.push(item);
            }
            if (datos[i].hasOwnProperty('nocturnos')) {
              // trae datos para procesos diurnos
              if (datos[i].nocturnos.hasOwnProperty('afore')) {
                // trae datos para procesos nocturnos de afore
                const objAfore = datos[i].nocturnos.afore;
                for (let i in objAfore) {
                  const objProceso = Object.keys(objAfore[i])[0];
                  const objDetalle = objAfore[i]['' + objProceso + ''];
                  const objLanzamiento = Object.keys(objDetalle);
                  // conteo de ejecuciones exitosas y fallidas
                  for (const j in objLanzamiento) {
                    const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
                    if (objDetalleInicio.exitosos) {
                      sumaNocturnoExito += objDetalleInicio.exitosos;
                    }
                    if (objDetalleInicio.fallidos) {
                      for (const key in objDetalleInicio.fallidos) {
                        sumaNocturnoFallo += objDetalleInicio.fallidos[key];
                      }
                    }
                  }
                }
              }
              if (datos[i].nocturnos.hasOwnProperty('fondos')) {
                // trae datos para procesos nocturnos de fondos
                const objFondos = datos[i].nocturnos.fondos;
                for (let i in objFondos) {
                  const objProceso = Object.keys(objFondos[i])[0];
                  const objDetalle = objFondos[i]['' + objProceso + ''];
                  const objLanzamiento = Object.keys(objDetalle);
                  // conteo de ejecuciones exitosas y fallidas
                  for (const j in objLanzamiento) {
                    const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
                    if (objDetalleInicio.exitosos) {
                      sumaNocturnoExito += objDetalleInicio.exitosos;
                    }
                    if (objDetalleInicio.fallidos) {
                      for (const key in objDetalleInicio.fallidos) {
                        sumaNocturnoFallo += objDetalleInicio.fallidos[key];
                      }
                    }
                  }
                }
              }
              // añadir resumen a la respuesta
              const item = {
                name: fechaDescripcion,
                value: sumaNocturnoExito + sumaNocturnoFallo
              };
              itemsNocturnos.push(item);
            }
          }
        }
      }
      // genereacion de la respuesta
      let response = [
        {
          "name": "Diurnos",
          "series": itemsDiurnos
        },
        {
          "name": "Nocturnos",
          "series": itemsNocturnos
        }
      ];
      return response
    }
  }

  /* Funcion para generar los datos del resumen de las operaciones
    detalladas para diurnos y nocturnos */
  resumenGraficoAnual(datos: any): any {
    let response;
    let diurnoAforeExito = 0;
    let diurnoAforeFallo = 0;
    let diurnoFondosExito = 0;
    let diurnoFondosFallo = 0;
    let nocturnoAforeExito = 0;
    let nocturnoAforeFallo = 0;
    let nocturnoFondosExito = 0;
    let nocturnoFondosFallo = 0;
    // validacion existencia de ejecuciones
    if (this.isObjEmpty(datos) === false) {
      for (let i in datos) {
        if (this.isObjEmpty(datos[i]) === false) {
          if (datos[i].hasOwnProperty('fecha_inicio')) {
            if (datos[i].hasOwnProperty('diurnos')) {
              // trae datos para procesos diurnos
              if (datos[i].diurnos.hasOwnProperty('afore')) {
                // trae datos para procesos diurnos de afore
                const objAfore = datos[i].diurnos.afore;
                for (let i in objAfore) {
                  const objProceso = Object.keys(objAfore[i])[0];
                  const objDetalle = objAfore[i]['' + objProceso + ''];
                  const objLanzamiento = Object.keys(objDetalle);
                  // conteo de ejecuciones
                  for (const j in objLanzamiento) {
                    const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
                    if (objDetalleInicio.exitosos) {
                      diurnoAforeExito += objDetalleInicio.exitosos;
                    }
                    if (objDetalleInicio.fallidos) {
                      for (const key in objDetalleInicio.fallidos) {
                        diurnoAforeFallo += objDetalleInicio.fallidos[key];
                      }
                    }
                  }
                }
              }
              if (datos[i].diurnos.hasOwnProperty('fondos')) {
                // trae datos para procesos diurnos de fondos
                const objFondos = datos[i].diurnos.fondos;
                for (let i in objFondos) {
                  const objProceso = Object.keys(objFondos[i])[0];
                  const objDetalle = objFondos[i]['' + objProceso + ''];
                  const objLanzamiento = Object.keys(objDetalle);
                  for (const j in objLanzamiento) {
                    const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
                    if (objDetalleInicio.exitosos) {
                      diurnoFondosExito += objDetalleInicio.exitosos;
                    }
                    if (objDetalleInicio.fallidos) {
                      for (const key in objDetalleInicio.fallidos) {
                        diurnoFondosFallo += objDetalleInicio.fallidos[key];
                      }
                    }
                  }
                }
              }
            }
            if (datos[i].hasOwnProperty('nocturnos')) {
              // trae datos para procesos diurnos
              if (datos[i].nocturnos.hasOwnProperty('afore')) {
                // trae datos para procesos nocturnos de afore
                const objAfore = datos[i].nocturnos.afore;
                for (let i in objAfore) {
                  const objProceso = Object.keys(objAfore[i])[0];
                  const objDetalle = objAfore[i]['' + objProceso + ''];
                  const objLanzamiento = Object.keys(objDetalle);
                  for (const j in objLanzamiento) {
                    const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
                    if (objDetalleInicio.exitosos) {
                      nocturnoAforeExito += objDetalleInicio.exitosos;
                    }
                    if (objDetalleInicio.fallidos) {
                      for (const key in objDetalleInicio.fallidos) {
                        nocturnoAforeFallo += objDetalleInicio.fallidos[key];
                      }
                    }
                  }
                }
              }
              if (datos[i].nocturnos.hasOwnProperty('fondos')) {
                // trae datos para procesos nocturnos de fondos
                const objFondos = datos[i].nocturnos.fondos;
                for (let i in objFondos) {
                  const objProceso = Object.keys(objFondos[i])[0];
                  const objDetalle = objFondos[i]['' + objProceso + ''];
                  const objLanzamiento = Object.keys(objDetalle);
                  for (const j in objLanzamiento) {
                    const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
                    if (objDetalleInicio.exitosos) {
                      nocturnoFondosExito += objDetalleInicio.exitosos;
                    }
                    if (objDetalleInicio.fallidos) {
                      for (const key in objDetalleInicio.fallidos) {
                        nocturnoFondosFallo += objDetalleInicio.fallidos[key];
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    // generacion de resumen
    response = {
      diurnoAforeExito: diurnoAforeExito,
      diurnoAforeFallo: diurnoAforeFallo,
      diurnoAforeTotal: diurnoAforeExito + diurnoAforeFallo,
      diurnoFondosExito: diurnoFondosExito,
      diurnoFondosFallo: diurnoFondosFallo,
      diurnoFondosTotal: diurnoFondosExito + diurnoFondosFallo,
      nocturnoAforeExito: nocturnoAforeExito,
      nocturnoAforeFallo: nocturnoAforeFallo,
      nocturnoAforeTotal: nocturnoAforeExito + nocturnoAforeFallo,
      nocturnoFondosExito: nocturnoFondosExito,
      nocturnoFondosFallo: nocturnoFondosFallo,
      nocturnoFondosTotal: nocturnoFondosExito + nocturnoFondosFallo,
    };
    return response
  }

  /*
    Funcion para dar formato a los datos del reporte mensual para visualizar en la tabla de resumen
    Entrada:
      {
      "diurnos": {
        "fondos": [{
          "MANDATOS": {
            "manual": {
              "exitosos": 38,
              "fallidos": {
                "BRS": 1,
                "PIP": 0,
                "TI": 40,
                "Usuario": 0
              }
            }
          }
        }]
      }
    }
    Salida:
    ['MANDATOS', '38', '41']
    */
  formatoDatosReporteAnual(datos: any, meses: any) {
    let datosFormateados: any = [];
    // generacion de fila tipo header
    const titulo = [
      { text: 'Mes', bold: true },
      { text: 'Interfaz', bold: true },
      { text: '# ejecuciones exitosas', bold: true },
      { text: '# ejecuciones fallidas', bold: true },
    ];
    datosFormateados.push(titulo);
    // validacion de existencia de datos
    if (this.isObjEmpty(datos) === false) {
      let mesActual;
      let anioActual;
      let fechaDescripcion;
      let dias;
      for (let i in datos) {
        if (this.isObjEmpty(datos[i]) === false) {
          if (datos[i].hasOwnProperty('fecha_inicio')) {
            // generacion de campo fecha en formato 'Agosto 2021'
            mesActual = this.obtenerMes(datos[i].fecha_inicio);
            anioActual = this.obtenerAnio(datos[i].fecha_inicio);
            dias = meses.filter(element => element.id === mesActual);
            fechaDescripcion = dias[0].descripcion + ' ' + anioActual;
            if (datos[i].hasOwnProperty('diurnos')) {
              if (datos[i].diurnos.hasOwnProperty('afore')) {
                const objAfore = datos[i].diurnos.afore;
                for (let i in objAfore) {
                  const objProceso = Object.keys(objAfore[i])[0];
                  const objDetalle = objAfore[i]['' + objProceso + ''];
                  const objLanzamiento = Object.keys(objDetalle);
                  let sumAforeExito = 0;
                  let sumAforeFallo = 0;
                  // conteo de ejecuciones
                  for (const j in objLanzamiento) {
                    const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
                    if (objDetalleInicio.exitosos) {
                      sumAforeExito += objDetalleInicio.exitosos;
                    }
                    if (objDetalleInicio.fallidos) {
                      for (const key in objDetalleInicio.fallidos) {
                        sumAforeFallo += objDetalleInicio.fallidos[key];
                      }
                    }
                    // añadir resumen a la respuesta
                    const item = [
                      fechaDescripcion,
                      objProceso,
                      sumAforeExito,
                      sumAforeFallo,
                    ];
                    datosFormateados.push(item);
                  }
                }
              }
              // validacion de ejecucines para fondos
              if (datos[i].diurnos.hasOwnProperty('fondos')) {
                const objFondos = datos[i].diurnos.fondos;
                for (let i in objFondos) {
                  const objProceso = Object.keys(objFondos[i])[0];
                  const objDetalle = objFondos[i]['' + objProceso + ''];
                  const objLanzamiento = Object.keys(objDetalle);
                  let sumAforeExito = 0;
                  let sumAforeFallo = 0;
                  // conteo de ejecuciones
                  for (const j in objLanzamiento) {
                    const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
                    if (objDetalleInicio.exitosos) {
                      sumAforeExito += objDetalleInicio.exitosos;
                    }
                    if (objDetalleInicio.fallidos) {
                      for (const key in objDetalleInicio.fallidos) {
                        sumAforeFallo += objDetalleInicio.fallidos[key];
                      }
                    }
                    // resumen añadido a la respuesta
                    const item = [
                      fechaDescripcion,
                      objProceso,
                      sumAforeExito,
                      sumAforeFallo,
                    ];
                    datosFormateados.push(item);
                  }
                }
              }
            }
            // validaciones para procesos nocturnos de afore
            if (datos[i].hasOwnProperty('nocturnos')) {
              if (datos[i].nocturnos.hasOwnProperty('afore')) {
                const objAfore = datos[i].nocturnos.afore;
                for (let i in objAfore) {
                  const objProceso = Object.keys(objAfore[i])[0];
                  const objDetalle = objAfore[i]['' + objProceso + ''];
                  const objLanzamiento = Object.keys(objDetalle);
                  let sumAforeExito = 0;
                  let sumAforeFallo = 0;
                  // conteo de ejecuciones
                  for (const j in objLanzamiento) {
                    const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
                    if (objDetalleInicio.exitosos) {
                      sumAforeExito += objDetalleInicio.exitosos;
                    }
                    if (objDetalleInicio.fallidos) {
                      for (const key in objDetalleInicio.fallidos) {
                        sumAforeFallo += objDetalleInicio.fallidos[key];
                      }
                    }
                    // resumen añadido a la respuesta
                    const item = [
                      fechaDescripcion,
                      objProceso,
                      sumAforeExito,
                      sumAforeFallo,
                    ];
                    datosFormateados.push(item);
                  }
                }
              }
              // validacion de ejecuciones para fondos
              if (datos[i].nocturnos.hasOwnProperty('fondos')) {
                const objFondos = datos[i].nocturnos.fondos;
                for (let i in objFondos) {
                  const objProceso = Object.keys(objFondos[i])[0];
                  const objDetalle = objFondos[i]['' + objProceso + ''];
                  const objLanzamiento = Object.keys(objDetalle);
                  let sumAforeExito = 0;
                  let sumAforeFallo = 0;
                  // conteo de ejecuciones
                  for (const j in objLanzamiento) {
                    const objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
                    if (objDetalleInicio.exitosos) {
                      sumAforeExito += objDetalleInicio.exitosos;
                    }
                    if (objDetalleInicio.fallidos) {
                      for (const key in objDetalleInicio.fallidos) {
                        sumAforeFallo += objDetalleInicio.fallidos[key];
                      }
                    }
                    // resumen del conteo que se añade al response
                    const item = [
                      fechaDescripcion,
                      objProceso,
                      sumAforeExito,
                      sumAforeFallo,
                    ];
                    datosFormateados.push(item);
                  }
                }
              }
            }
          }

        }
      }
    }
    return datosFormateados;
  }
}