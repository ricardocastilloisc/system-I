import { AppState } from './../../../ReduxStore/app.reducers';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { APIService } from '../../../API.service';
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
  Noticaciones$: any;

  constructor(
    private api: APIService,
    private store: Store<AppState>,
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
    this.LoadingDetailCatalogos$ = this.store
      .select(({ DetailCatalogos }) => DetailCatalogos.loading)
      .subscribe((res) => {
        if (res) {
          this.spinner.show();
        } else {
          this.spinner.hide();
        }
      });
  }
}
