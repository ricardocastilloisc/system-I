import { AppState } from './../../../ReduxStore/app.reducers';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import Auth from '@aws-amplify/auth';
import { convertToObject } from 'typescript';
import { APIService } from '../../../API.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import {
  cargarCatalogos,
  unSetCatalogos,
} from '../../../ReduxStore/actions/catalogos/catalogos.actions';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  LoadingDetailCatalogos$: Subscription;

  constructor(
    private api: APIService,
    private store: Store<AppState>,
    private NotificacionesService: NotificacionesService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnDestroy(): void {
    this.store.dispatch(unSetCatalogos());
  }

  ngAfterViewInit(): void {
    window.history.replaceState(null, null, window.location.pathname);
  }
  ngOnInit(): void {
    this.store.dispatch(cargarCatalogos());

    this.NotificacionesService.obtenerListadoDeNotificaciones();

    setInterval(() => {
      this.NotificacionesService.obtenerListadoDeNotificaciones();
    }, 50000);

    this.LoadingDetailCatalogos$ = this.store
      .select(({ DetailCatalogos }) => DetailCatalogos.loading)
      .subscribe((res) => {
        if (res) {
          this.spinner.show();
        } else {
          this.spinner.hide();
        }
      });

    /*
    this.api.OnCreateSiaGenAudEstadoProcesosDevListener.subscribe({
      next: ({ value }: any) => {
        console.log(value)
      },
    });*/

    this.api.OnCreateSiaGenAudEstadoProcesosDevListener.subscribe(
      ({ value }: any) => {
        const { data } = value;
        console.log('-----');
        console.log('-------');
        console.log('OnCreateSiaGenAudEstadoProcesosDevListener');
        console.log(data);
        console.log('-------');
        console.log('-------');
      }
    );

    this.api.OnUpdateSiaGenAudEstadoProcesosDevListener.subscribe((res) => {
      console.log('++++++++++++++');
      console.log('++++++++++++++');
      console.log('OnUpdateSiaGenAudEstadoProcesosDevListener');
      console.log(res);
      console.log('++++++++++++++');
      console.log('++++++++++++++');
    });
  }
}
