import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { setUserRol } from '../../ReduxStore/actions/usuario.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../ReduxStore/app.reducers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService, private store: Store<AppState>) { }

  ngOnInit(): void {
    var end, start;
    start = new Date();
    end = new Date();
    console.log('Operation: ' + (end.getTime() - start.getTime()) + ' msec');
  }

  login = () => {
    //this.auth.signIn();
    localStorage.setItem("SIA","true");
    this.auth.goLogin();
  };

  validarInicioSesion(): any {
    let flag = false;
    if (localStorage.getItem("SIA")) {
      if (localStorage.getItem("SIA").length > 0) {
        flag = true;
      }
    }
    return flag;
  }
}
