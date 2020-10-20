import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StringifyOptions } from 'querystring';
import { User } from '../User';
import { Subscription } from 'rxjs';
import { UserserviceService } from '../userservice.service';
import { AuthData } from '../auth-data.model';

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.css']
})
export class ChangepassComponent implements OnInit {
  username: string;
  newpassword: string;
  oldpassword: string;
  confirmNewpassword: string;

  user: User;
  users: User[]=[];
  private userSub: Subscription;

  constructor(private userService: UserserviceService) { }

  ngOnInit(): void {
    this.userService.getUsers();
    this.userSub=this.userService.getUserUpdateListener().subscribe((users: User[])=>{
      this.users=this.users;
    });
  }

  change(form: NgForm): void{
    if(this.newpassword!== this.confirmNewpassword){
      alert("Password and confirm password dismatch");
      return;
    }
    this.userService.changePassword(this.username,this.oldpassword,this.newpassword);
    this.userSub=this.userService.getUserUpdateListener()
    .subscribe((users:AuthData[])=>{
      this.userService.getUsers();
      this.users=users;
    });
    form.reset();
  }
}

