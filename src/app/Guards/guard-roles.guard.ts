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
          Usuario.fromAmplify(new User(result)).groups.forEach((element) => {
            if (route.data.roles.includes(element)) {
              flagRoute = true;
            }
          });
          if (!flagRoute) {
            this._router.navigate(['/dashboard']);
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
