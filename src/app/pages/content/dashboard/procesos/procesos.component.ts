import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.css']
})
export class ProcesosComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  consultar(){
    this.router.navigate(['/proceso']);
  }
}
