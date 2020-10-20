import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/User';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserserviceService } from 'src/app/userservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  type: string;
  message: string;

  users: User[]=[];
  private userSub: Subscription;
  constructor(private router: Router, public userService: UserserviceService) { }

  ngOnInit(): void {
    this.userService.getUsers();
    this.userSub=this.userService.getUserUpdateListener().subscribe((users: User[])=>{
      this.users=users;
    });
    this.message="";
  }

  login(form: NgForm){
    if(form.invalid) return;
    this.message=this.userService.login(form.value.username, form.value.password, form.value.type);
    const current=this.username;
    const currentType=this.type;
    localStorage.setItem('current', current);
    localStorage.setItem('type',currentType);
  }
}
