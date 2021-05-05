import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})

let uuid = uuidv4();

export class ProcesosService {

  constructor() { }
}
