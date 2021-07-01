import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CognitoUser, Auth } from '@aws-amplify/auth';
import { User } from '../model/user';
import { Usuario } from '../model/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class GuardRolesGuard implements CanActivate {
  constructor(private _router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return Auth.currentAuthenticatedUser()
      .then((result: CognitoUser) => {
        if (result.getSignInUserSession().isValid()) {
          let flagRoute = false;
          let usuario = Usuario.fromAmplify(new User(result));
          if (!usuario.attributes.hasOwnProperty('custom:rol')){
            flagRoute = false;
          }else {
            if (route.data.roles.includes(usuario.attributes['custom:rol'])){
              flagRoute = true;
            }
          }
          if (!flagRoute) {
            this._router.navigate(['/']);
            return false;
          } else {
            return true;
          }
        } else {
          this._router.navigate(['/login']);
          return false;
        }
      })
      .catch(() => {
        return true;
      });
  }
}
