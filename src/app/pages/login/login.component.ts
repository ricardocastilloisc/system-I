import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { setUserRol } from '../../ReduxStore/actions/usuario.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../ReduxStore/app.reducers';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  constructor(
    private usuario: UsuariosService, private auth: AuthService, private store: Store<AppState>) { }

  ngOnInit(): void {
    /*
    const UserAttributes = [
      {
        Name: 'custom:negocio',
        Value: 'Afore',
      },
      {
        Name: 'custom:rol',
        Value: 'Administrador',
      },
    ];
    const Username = 'azure_jyjzfei0rp_hdfd7jh_j8halgegmlsfiudwyrgnw2ya';
    this.usuario.actualizarAtributosUsuarioCallback(UserAttributes, Username);
    */

    if (localStorage.getItem("SIA")) {
      let start, end;
      start = localStorage.getItem("SIA");
      end = new Date().getTime();
      start = parseInt(localStorage.getItem("SIA"));
      const time = end - start;
      console.log(time);
      if (localStorage.getItem("SIA").length > 0 && time > 180000) {
        localStorage.removeItem("SIA");
      }
    }
  }

  login = () => {
    const time = new Date().getTime();
    localStorage.setItem("SIA", time.toString());
    this.auth.signIn();
  };

  validarInicioSesion(): any {
    let flag = false;
    if (localStorage.getItem("SIA")) {
      let start, end;
      start = localStorage.getItem("SIA");
      end = new Date().getTime();
      start = parseInt(localStorage.getItem("SIA"));
      const time = end - start;
      if (localStorage.getItem("SIA").length > 0 && time > 1000) {
        flag = true;
      }
    }
    return flag;
  }
}
