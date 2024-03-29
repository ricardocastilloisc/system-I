import { Injectable} from '@angular/core';
import {
  ActivatedRoute,
  CanLoad,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap} from 'rxjs/operators';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements  CanLoad {
  constructor(
    private _router: Router,
    private authService: AuthService
  ) {}

  canLoad(): Observable<boolean> {
    return this.authService.isAuth().pipe(
      tap((user:any) => {
        if (!user) {
          this._router.navigate(['/login']);
        }
      }),
      take(1)
    );
  }

}
