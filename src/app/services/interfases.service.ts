import { Injectable } from '@angular/core';

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
    },{
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
    },{
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

  tree = [
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

  four = [
    {
      name: 'Manual',
      value: 8,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    },
    {
      name: 'Automático',
      value: 4,
      extra: {
        code: 'tst',
        fail: {
          black: 'true'
        }
      }
    }
  ];

  treemap = [
    {
      name: 'Ejecuciones',
      children: [
        {
          name: 'Afore',
          children: [
            {
              name: 'Exitosos',
              children: [
                {
                  name: 'INT CASH',
                  children: [
                    { name: 'Manuales', size: 1212 },
                    { name: 'Automáticos', size: 3612 }
                  ]
                },
                {
                  name: 'MO',
                  children: [
                    { name: 'Automáticos', size: 2541 }
                  ]
                },
                {
                  name: 'MD',
                  children: [
                    { name: 'Automáticos', size: 2812 }
                  ]
                },
                {
                  name: 'AIMS Y EXCEDENTES',
                  children: [
                    { name: 'Manuales', size: 2812 },
                    { name: 'Automáticos', size: 512 }
                  ]
                }
              ],
            },
            {
              name: 'Fallidos',
              children: [
                {
                  name: 'INT CASH',
                  children: [
                    { name: 'Manuales', size: 212 },
                    { name: 'Automáticos', size: 612 }
                  ]
                },
                {
                  name: 'MO',
                  children: [
                    { name: 'Automáticos', size: 541 }
                  ]
                },
                {
                  name: 'MD',
                  children: [
                    { name: 'Automáticos', size: 812 }
                  ]
                },
                {
                  name: 'AIMS Y EXCEDENTES',
                  children: [
                    { name: 'Manuales', size: 812 },
                    { name: 'Automáticos', size: 112 }
                  ]
                }
              ],
            }
          ]
        },
        {
          name: 'Fondos',
          children: [
            {
              name: 'Exitosos',
              children: [
                {
                  name: 'CRD',
                  children: [
                    { name: 'Manuales', size: 2812 },
                    { name: 'Automáticos', size: 812 }
                  ]
                },
                {
                  name: 'Mandatos',
                  children: [
                    { name: 'Manuales', size: 1612 },
                    { name: 'Automáticos', size: 312 }
                  ]
                }
              ],
            },
            {
              name: 'Fallidos',
              children: [
                {
                  name: 'CRD',
                  children: [
                    { name: 'Manuales', size: 612 },
                    { name: 'Automáticos', size: 92 }
                  ]
                },
                {
                  name: 'Mandatos',
                  children: [
                    { name: 'Manuales', size: 512 },
                    { name: 'Automáticos', size: 104 }
                  ]
                }
              ],
            }
          ]
        }
      ]
    }];

  constructor() { }
}
