import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.css']
})
export class ProcesosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  enProgreso():boolean {
    return true;
  }
  verAuditoria():boolean {
    return false;
  }
  
}
