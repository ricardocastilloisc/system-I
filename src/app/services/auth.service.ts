import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import Amplify, { Auth } from 'aws-amplify';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map } from 'rxjs/operators';
import { CognitoUser } from '@aws-amplify/auth';
import { Store } from '@ngrx/store';
import { AppState } from '../ReduxStore/app.reducers';
import * as authActions from '../ReduxStore/actions/usuario.actions';
import { User } from '../model/user';
import { Usuario } from '../model/usuario.model';
import { Router } from '@angular/router';

Amplify.configure(environment.amplifyConfig);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private store: Store<AppState>, private router: Router) {}

  initAuthData = () => {
    Auth.currentAuthenticatedUser()
      .then(async (result: CognitoUser) => {
        if (result.getSignInUserSession().isValid()) {
          const user = Usuario.fromAmplify(
            new User(result)
          );
          if(!this.getToken())localStorage.setItem('access',(await Auth.currentSession()).getAccessToken().getJwtToken().toString());
          this.store.dispatch(authActions.setUser({ user }));
        } else {
          this.store.dispatch(authActions.unSetUser());
        }
      })
      .catch(() => this.store.dispatch(authActions.unSetUser()));
  };

  goLogin = () => {
    window.location.assign(environment.urlExternalLogin);
  };

  isAuth = () => {
    return fromPromise(this.userPromise()).pipe(map((user) => user != null));
  };

  userPromise = () => {
    return new Promise(async (resolve) => {
      return await Auth.currentAuthenticatedUser()
        .then((result: CognitoUser) => {
          if (result.getSignInUserSession().isValid()) {
            resolve(result);
          } else {
            resolve(null);
          }
        })
        .catch(() => resolve(null));
    });
  };

  signOut = () => {
    localStorage.clear();
    this.cleanStates();
    this.router.navigate(['/login']);
  };

  cleanStates = () => {
    this.store.dispatch(authActions.unSetUser());
  }


  getToken = ():String => {
    return localStorage.getItem('access');
  }
}
