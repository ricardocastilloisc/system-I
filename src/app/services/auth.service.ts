import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import Amplify, { Auth } from 'aws-amplify';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map } from 'rxjs/operators';
import { CognitoUser } from '@aws-amplify/auth';

Amplify.configure(environment.amplifyConfig);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

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
}
