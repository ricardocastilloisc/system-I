import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
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

    if (localStorage.getItem('SIA')) {
      let start;
      let end;
      start = localStorage.getItem('SIA');
      end = new Date().getTime();
      start = parseInt(localStorage.getItem('SIA'));
      const time = end - start;
      if (localStorage.getItem('SIA').length > 0 && time > 180000) {
        localStorage.removeItem('SIA');
      }
    }
  }

  login = () => {
    const time = new Date().getTime();
    localStorage.setItem('SIA', time.toString());
    this.auth.signIn();
  }

  validarInicioSesion(): any {
    let flag = false;
    if (localStorage.getItem('SIA')) {
      let start;
      let end;
      start = localStorage.getItem('SIA');
      end = new Date().getTime();
      start = parseInt(localStorage.getItem('SIA'));
      const time = end - start;
      if (localStorage.getItem('SIA').length > 0 && time > 1000) {
        flag = true;
      }
    }
    return flag;
  }
}
