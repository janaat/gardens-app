import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserserviceService } from './userservice.service';
import { GardenserviceService } from './gardenservice.service';

@Injectable()
export class FarmGuard implements CanActivate {
  isFarmer: boolean;
  constructor(private gardenService: GardenserviceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot
              ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
                this.isFarmer=this.gardenService.getIsFarmer();

                if (!this.isFarmer) {
                  this.router.navigate(['/']);
                }
                return this.isFarmer;
  }

}
