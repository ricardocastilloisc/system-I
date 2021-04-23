import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { AppState } from '../../../ReduxStore/app.reducers';
import { Usuario } from '../../../model/usuario.model';
import { Observable } from 'rxjs';
import { ERole } from '../../../validators/roles';
declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  DataUser$: Observable<Usuario>;

  Administrador = ERole.Administrador;
  Ejecutor = ERole.Ejecutor;
  Soporte = ERole.Soporte;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);
  }

  signOut = () => {
    this.authService.signOut();
  };

  rolesValids = (User:Usuario, roles:any[]):boolean => {
    return this.authService.rolesValids(User, roles);
  }


  toggle = () => {
    $('#sidebar').toggleClass('active');

    /*

    $("#content").css("background", "red");

    if($("#sidebar").hasClass("active")){
      console.log('hey hola mundo');
    }*/

  };
}
