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
    }
  ];

  two = [
    {
      name: 'Exitos',
      value: 12,
      extra: {
        code: 'tst'
      }
    },
    {
      name: 'Fallos',
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

  constructor8() { }
}
