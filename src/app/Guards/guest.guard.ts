import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CognitoUser, Auth } from '@aws-amplify/auth';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private _router: Router) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return Auth.currentAuthenticatedUser()
      .then((result: CognitoUser) => {
        if (result.getSignInUserSession().isValid()) {
          this._router.navigate(['/dashboard']);
          return false;
        } else {
          return true;
        }
      })
      .catch(() => {
        return true;
      });
  }
}
