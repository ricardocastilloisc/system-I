import { HttpHeaders } from '@angular/common/http';
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
import { EArea, ERole } from '../validators/roles';
import { setUserArea } from '../ReduxStore/actions/usuario.actions';


try {
  Amplify.configure(environment.amplifyConfig);
} catch (e) {
  console.log('Error Amplify Configuration: ', e);
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  codeChallenge: string;
  constructor(private store: Store<AppState>, private router: Router) { }

  initAuthData = () => {
    Auth.currentAuthenticatedUser()
      .then(async (result: CognitoUser) => {
        //console.log("AUTH SERVICE");
        //console.log('Usser result: ',JSON.stringify(result));
        if (result.getSignInUserSession().isValid()) {
          const user = Usuario.fromAmplify(new User(result));


          localStorage.setItem(
            'access',
            (await Auth.currentSession())
              .getAccessToken()
              .getJwtToken()
              .toString()
          );

          const areas = [
            EArea.Tesoreria,
            EArea.Inversiones_Riesgos,
            EArea.Contabilidad,
            EArea.Custodia,
            EArea.Soporte,
          ];

          let areasStore = [];
          user.attributes['cognito:groups'].forEach((e) => {
            if (areas.includes(e)) {
              areasStore.push(e);
            }
          });

          //console.log("user", user);
          if (areasStore.includes(EArea.Soporte)) {
            user.attributes['custom:rol'] = ERole.Administrador;
          }

          if (!user.attributes.given_name) {
            user.attributes.given_name = user.name + ' - Guest';
          }

          localStorage.setItem(
            'area',
            areasStore.toString()
          );

          // console.log('negocio', user.attributes['custom:negocio']);

          localStorage.setItem(
            'negocio',
            user.attributes['custom:negocio']
          );


          this.store.dispatch(authActions.setUser({ user }));
          let area = this.obtenerArea();
          //console.log(area)
          this.store.dispatch(
            setUserArea({
              area: area,
            })
          );
        } else {
          this.store.dispatch(authActions.unSetUser());
        }
      })
      .catch(() => this.store.dispatch(authActions.unSetUser()));
  };

  signIn = () => {
    window.location.assign(environment.urlExternalLogin);
  };


  userHeaders() {
    return new HttpHeaders({
      'authorization': 'Bearer ' + this.getToken(),
      'content-type': 'application/json'
    });
  }



  refreshToken = async () => {


    this.initAuthData()
    // try {
    //   const cognitoUser = await Auth.currentAuthenticatedUser({bypassCache: true});
    //   console.log(cognitoUser)
    //   const currentSession = await Auth.currentSession();
    //   console.log(currentSession)
    //   cognitoUser.refreshSession(currentSession.getRefreshToken(), (err, session) => {
    //     console.log('session', err, session);
    //     const { idToken, refreshToken, accessToken } = session;
    //     // do whatever you want to do now :)
    //   });
    // } catch (e) {
    //   console.log('Unable to refresh Token', e);
    // }
    // console.log((await Auth.currentSession()).getRefreshToken())

  }

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
  };

  getToken = (): String => {
    return localStorage.getItem('access');
  };

  login = async () => {
    await Auth.federatedSignIn({ customProvider: 'SAML' });
  };

  rolesValids = (User: Usuario, roles: any[], Area?): boolean => {
    let flagValidate = false;
    if (!User.attributes.hasOwnProperty('custom:rol')) {
      return flagValidate;
    } else {
      if (Area) {
        if (roles.includes(User.attributes['custom:rol']) && Area == 'SOPORTE')
          console.log('entre al area');
        flagValidate = true;
      } else if (roles.includes(User.attributes['custom:rol'])) {
        flagValidate = true;
      }
    }
    return flagValidate;
  };

  perfilValido = (User: Usuario, roles: any[]): boolean => {
    //console.log("perfilValido");
    let flagValidate = false;
    let arrayTempArea = [];
    let Areas = [
      EArea.Contabilidad,
      EArea.Custodia,
      EArea.Inversiones_Riesgos,
      EArea.Tesoreria,
      EArea.Soporte,
    ];
    User.groups.forEach((area) => {
      Areas.forEach((areaDef) => {
        if (area === areaDef) {
          arrayTempArea.push(area);
        }
      });
    });
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
    } else {
      flagValidate = false;
    }
    return flagValidate;
  };

  obtenerArea(): any {
    let area = '';
    let arrayTempArea = [];
    let areas = [
      EArea.Contabilidad,
      EArea.Custodia,
      EArea.Inversiones_Riesgos,
      EArea.Tesoreria,
      EArea.Soporte,
    ];
    this.store
      .select(({ usuario }) => usuario.user.groups)
      .subscribe((res) => {
        res.forEach((item) => {
          if (areas.includes(item)) {
            arrayTempArea.push(item);
          }
        });
      });
    area = arrayTempArea.join(', ');
    return area;
  }
}
