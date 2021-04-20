import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-procesos-pantalla-general',
  templateUrl: './procesos-pantalla-general.component.html',
  styleUrls: ['./procesos-pantalla-general.component.css'],
})
export class ProcesosPantallaGeneralComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  consultar = () => {
    this.router.navigate(['/' + window.location.pathname + '/proceso']);
  };
}
