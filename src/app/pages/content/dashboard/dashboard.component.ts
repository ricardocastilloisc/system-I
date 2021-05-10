import { Component, OnInit, AfterViewInit } from '@angular/core';
import Auth from '@aws-amplify/auth';
import { convertToObject } from 'typescript';
import { APIService } from '../../../API.service';
import { NotificacionesService } from '../../../services/notificaciones.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  constructor(private api: APIService,private NotificacionesService: NotificacionesService ) { }

  ngAfterViewInit(): void {
    window.history.replaceState(null, null, window.location.pathname);
  }
  ngOnInit(): void {


    this.NotificacionesService.obtenerListadoDeNotificaciones();

    setInterval(() =>{
      this.NotificacionesService.obtenerListadoDeNotificaciones();
    }, 50000);


    this.api.OnDeleteCATPROCESOSListener().subscribe((res) => {
      //console.log('OnDeleteCATPROCESOSListener');
      //console.log('se elimino');
      //console.log(res);
    });
  }
}
