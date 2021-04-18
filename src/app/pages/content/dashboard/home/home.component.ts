import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../services/auth.service';
import { AppState } from '../../../../ReduxStore/app.reducers';
import { Usuario } from 'src/app/model/usuario.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  DataUser$: Observable<Usuario>

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.DataUser$ = this.store.select( ({usuario}) => usuario.user)
  }

}
