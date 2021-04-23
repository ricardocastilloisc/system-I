import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ReduxStore/app.reducers';
import { Usuario } from 'src/app/model/usuario.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { ERole } from '../../../../validators/roles';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  DataUser$: Observable<Usuario>;

  Administrador = ERole.Administrador;
  Ejecutor = ERole.Ejecutor;
  Soporte = ERole.Soporte;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);
  }

  rolesValids = (User: Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids(User, roles);
  };
}
