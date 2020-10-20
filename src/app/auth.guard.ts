import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserserviceService } from './userservice.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userService: UserserviceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot
              ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
                const isAuth = this.userService.getIsAuth();

                if (!isAuth) {
                  this.router.navigate(['/']);
                }
                return isAuth;
  }

}
