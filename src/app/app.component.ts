import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserserviceService } from './userservice.service';
import { Subscription, timer } from 'rxjs';
import { GardenserviceService } from './gardenservice.service';
import { local } from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'rasadnik';

  constructor(private gardenService: GardenserviceService, private router: Router, private userService: UserserviceService) { }
  log;
  reg;
  cha;
  source=timer(0,3600000); //3600000

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  ngOnInit() {
    this.userService.autoAuthUser();
    let subscribe = this.source.subscribe(val => {console.log("TIK TAK");this.decrease(); console.log(val);});
    this.authListenerSubs = this.userService
    .getAuthStatusListener()
    .subscribe( isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
  login(): void {
    this.log = true;
    this.cha = false;
    this.reg = false;
    this.router.navigate(['']);

  }
  register(): void {
    this.reg = true;
    this.log = false;
    this.cha = false;
    this.router.navigate(['']);

  }

  change(): void {
    this.cha = true;
    this.reg = false;
    this.log = false;
    this.router.navigate(['']);
  }

  logout(): void {
    this.userService.logout();

    this.cha = false;
    this.reg = false;
    this.log = false;
    this.router.navigate(['']);
  }
  decrease(){
    console.log("Usao u decrease u app.component.ts");
    this.gardenService.decrease();
    console.log("Izasao iz decrease u app.component.ts");

  }
}
