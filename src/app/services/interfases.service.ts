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
}
