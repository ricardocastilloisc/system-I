import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class InterfasesService {

  single = [
    {
      name: 'MO',
      value: 12,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'MD',
      value: 8,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'INT CASH',
      value: 4,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'AIMS Y EXCEDENTES',
      value: 14,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'MO1',
      value: 12,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'MD1',
      value: 8,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'INT CASH1',
      value: 4,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'AIMS Y EXCEDENTES1',
      value: 14,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    }, {
      name: 'MO2',
      value: 12,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'MD2',
      value: 8,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'INT CASH2',
      value: 4,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'AIMS Y EXCEDENTES2',
      value: 14,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    }, {
      name: 'MO3',
      value: 12,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'MD3',
      value: 8,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'INT CASH3',
      value: 4,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'AIMS Y EXCEDENTES3',
      value: 14,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    }, {
      name: 'MO4',
      value: 12,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'MD4',
      value: 8,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'INT CASH4',
      value: 4,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'AIMS Y EXCEDENTES4',
      value: 14,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    }
  ];

  two = [
    {
      name: 'Exitosos',
      value: 12,
      extra: {
        code: 'tst'
      }
    },
    {
      name: 'Fallidos',
      value: 8,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    }
  ];

  capitalize (word: any): any {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }

  constructor(private authService: AuthService) { }

  getDatos = async (filtros: any) => {
    // console.log('getDatos', filtros);
    try {
      const url = environment.API.endpoints.find((el) => el.name === 'auditoria').endpoint + filtros;
      const myHeaders = new Headers();
      myHeaders.append('Authorization', 'Bearer ' + this.authService.getToken());
      const requestOptions = {
        method: 'GET',
        headers: myHeaders
      };
      const res = await fetch(url, requestOptions);
      // console.log(res.ok);
      const data = await res.json();
      // console.log(data);
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  formatoResumen = (data: any): any => {
    if (data) {
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
          for (const i in objAfore) {
            objProceso = Object.keys(objAfore[i])[0];
            objDetalle = objAfore[i]['' + objProceso + ''];
            objLanzamiento = Object.keys(objDetalle);
            // tslint:disable-next-line: forin
            for (const j in objLanzamiento) {
              objDetalleInicio = objDetalle['' + objLanzamiento[j] + ''];
              if (objDetalleInicio.exitosos) {
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
              if (objDetalleInicio.fallidos) {
                sample = objDetalleInicio.fallidos;
                summed = 0;
                // tslint:disable-next-line: forin
                for (const key in sample) {
                  summed += sample[key];
                }
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
              if (objDetalleInicio.exitosos) {
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
              if (objDetalleInicio.fallidos) {
                sample = objDetalleInicio.fallidos;
                summed = 0;
                // tslint:disable-next-line: forin
                for (const key in sample) {
                  summed += sample[key];
                }
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
      if (data.nocturnos) {
        objNocturnos = data.nocturnos;
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
              if (objDetalleInicio.exitosos) {
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
              if (objDetalleInicio.fallidos) {
                sample = objDetalleInicio.fallidos;
                summed = 0;
                // tslint:disable-next-line: forin
                for (const key in sample) {
                  summed += sample[key];
                }
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
              if (objDetalleInicio.exitosos) {
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
              if (objDetalleInicio.fallidos) {
                sample = objDetalleInicio.fallidos;
                summed = 0;
                // tslint:disable-next-line: forin
                for (const key in sample) {
                  summed += sample[key];
                }
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

  formatoDatosBarHorNegocio = (data: any): any => {
    const dataFormat = [
      {
        name: 'Afore',
        value: 12,
        extra: {
          code: 'tst',
          fail: {
            black: 'true'
          }
        }
      },
      {
        name: 'Fondos',
        value: 4,
        extra: {
          code: 'tst',
          fail: {
            black: 'true'
          }
        }
      }
    ];
    return dataFormat;
  }

  formatoDatosBarHorLanzamiento = (data: any): any => {
    const dataFormat = [
      {
        name: 'Afore',
        value: 12,
        extra: {
          code: 'tst',
          fail: {
            black: 'true'
          }
        }
      },
      {
        name: 'Fondos',
        value: 4,
        extra: {
          code: 'tst',
          fail: {
            black: 'true'
          }
        }
      }
    ];
    return dataFormat;
  }

  formatoDatosPieDiurnoAfore = (data: any): any => {
    const dataFormat = [
      {
        name: 'Exitosos',
        value: 12,
        extra: {
          code: 'tst'
        }
      },
      {
        name: 'Fallidos',
        value: 4,
        extra: {
          code: 'tst',
          fail: {
            black: 'true'
          },
        }
      }
    ];
    return dataFormat;
  }

  formatoDatosPieDiurnoFondos = (data: any): any => {
    const dataFormat = [
      {
        name: 'Exitosos',
        value: 12,
        extra: {
          code: 'tst'
        }
      },
      {
        name: 'Fallidos',
        value: 4,
        extra: {
          code: 'tst',
          fail: {
            black: 'true'
          }
        }
      }
    ];
    return dataFormat;
  }

}
