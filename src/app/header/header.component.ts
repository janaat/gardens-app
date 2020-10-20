import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserserviceService } from '../userservice.service';
import { GardenserviceService } from '../gardenservice.service';
import { local } from 'd3';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  userIsFarmer = false;
  private farmerListenerSubs: Subscription;

  constructor(
    private router: Router,
    private userService: UserserviceService,
    private gardenService: GardenserviceService
  ) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.userService.getIsAuth();
    if(this.userIsAuthenticated || this.userIsFarmer===true){localStorage.setItem("type","farmer");}
    this.authListenerSubs = this.userService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.userIsFarmer = this.userService.getIsFarmer(); // ??
    this.farmerListenerSubs = this.userService
      .getFarmerStatusListener()
      .subscribe((isFarmer) => {
        this.userIsFarmer = isFarmer;
      });
    // this.farmerListenerSubs = this.gardenService.getGardenUpdateListener()
    // .subscribe( isAuthenticated => {
    //  this.userIsFarmer = this.userIsFarmer;
    // });
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
  login(): void {
    this.router.navigate(['login']);
    this.ngOnInit();
  }
  gardens(): void {
    this.router.navigate(['farmer']);
    this.ngOnInit();
  }
  shop(): void {
    this.router.navigate(['shop']);
    this.ngOnInit();
  }
  register(): void {
    this.router.navigate(['register']);
  }
  change(): void {
    this.router.navigate(['changepass']);
  }
  logout(): void {
    localStorage.clear();
    this.userService.logout();
    this.router.navigate(['']);
    this.userIsFarmer = this.gardenService.check();
  }
}
