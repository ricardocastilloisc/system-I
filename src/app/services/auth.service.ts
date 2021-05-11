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
import { EArea } from '../validators/roles';
import { setUserArea } from '../ReduxStore/actions/usuario.actions';

try{
  Amplify.configure(environment.amplifyConfig);
} catch (e){
  console.log('Error Amplify Configuration: ', e);
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private store: Store<AppState>, private router: Router) { }

  initAuthData = () => {
    Auth.currentAuthenticatedUser()
      .then(async (result: CognitoUser) => {
        //console.log("AUTH SERVICE");
        //console.log(JSON.stringify(result));
        if (result.getSignInUserSession().isValid()) {
          const user = Usuario.fromAmplify(
            new User(result)
          );
          if (!this.getToken()) {
            localStorage.setItem('access', (await Auth.currentSession()).getAccessToken().getJwtToken().toString());
          }
          this.store.dispatch(authActions.setUser({ user }));
          let area = this.obtenerArea();
          this.store.dispatch(setUserArea({
            area: area
          }))
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
    //this.store.dispatch(authActions.unSetUser());
  }

  getToken = (): String => {
    return localStorage.getItem('access');
  }

  signIn = async () => {
    await Auth.federatedSignIn({ customProvider: "SAML" });
  }


  rolesValids = (User: Usuario, roles: any[], Area?): boolean => {
    let flagValidate = false;
    if (!User.attributes.hasOwnProperty('custom:rol')) {
      return flagValidate;
    } else {
      if (Area) {
        if (roles.includes(User.attributes['custom:rol']) && Area == 'SOPORTE')
          console.log('entre al area')
        flagValidate = true;
      } else
        if (roles.includes(User.attributes['custom:rol'])) {
          flagValidate = true;
        }
    }
    return flagValidate;
  }


  perfilValido = (User: Usuario, roles: any[]): boolean => {
    //console.log("perfilValido");
    let flagValidate = false;
    let arrayTempArea = [];
    let Areas = [
      EArea.Contabilidad,
      EArea.Custodia,
      EArea.Inversiones_Riesgos,
      EArea.Tesoreria,
      EArea.Soporte
    ];
    User.groups.forEach((area) => {
      Areas.forEach(areaDef => {
        if (area === areaDef) {
          arrayTempArea.push(area);
        }
      })
    })
    if (arrayTempArea.length > 0) {
      //console.log(arrayTempArea[0]);
      if (arrayTempArea[0] === 'Soporte') {
        flagValidate = true;
      } else {
        if (!User.attributes.hasOwnProperty('custom:rol')) {
          flagValidate = false;
        } else {
          if (roles.includes(User.attributes['custom:rol'])) {
            flagValidate = true;
          }
        }
      }
    }
    else {
      flagValidate = false;
    }
    return flagValidate;
  }

  obtenerArea(): any {
    let area = '';
    let arrayTempArea = [];
    let areas = [    EArea.Contabilidad,
      EArea.Custodia,
      EArea.Inversiones_Riesgos,
      EArea.Tesoreria,
      EArea.Soporte,];
    this.store.select(({ usuario }) => usuario.user.groups).subscribe(res => {
      res.forEach(item => {
        if (areas.includes(item)) {
          arrayTempArea.push(item);
        }
      })
    });
    area = arrayTempArea.join(', ');
    return area;
  }
}
