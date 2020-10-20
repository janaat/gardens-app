import { Component, OnInit } from '@angular/core';
import { AuthData } from '../auth-data.model';
import { User } from '../User';
import { UserserviceService } from '../userservice.service';
import { Subscription } from 'rxjs';
import { FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  user: AuthData;
  dateAdmin: Date;

  name: string;
  surname: string;
  username: string;
  password: string;
  email: string;
  confirmPassword: string;
  phone: string;
  date: Date;
  place: string;
  type: string;
  approved: boolean;
  message: string;

  private mode='create';
  private id: string;

  form: FormGroup;
  userN: AuthData;
  loading=false;
  isSubmitted=false;
  registerForm:FormGroup;
  userStatusSub: Subscription;


  private usersSub: Subscription;
  users: AuthData[] = [];
  constructor(public userService: UserserviceService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.userService.getUsers();
    this.usersSub = this.userService.getUserUpdateListener()
    .subscribe((users: User[]) => {
      this.users = users;
    });
    this.userStatusSub = this.userService.getAuthStatusListener().
    subscribe(userStatus =>{
      this.loading=false;
    })
  }
    register(form: NgForm){
      if(form.invalid) return;
      this.loading=true;
      this.userService.addUser(form.value.username, form.value.password, form.value.name, form.value.surname,
                                form.value.email, form.value.confirmPassword, form.value.type, form.value.data,form.value.place,
                                form.value.phone, form.value.approved);
        form.reset();


    }
    ngOnDestroy(){
      this.userStatusSub.unsubscribe();
    }

  approve(choosenUser: AuthData): void {
    this.userService.updateUser(choosenUser.username, choosenUser.password, choosenUser.name, choosenUser.surname, choosenUser.email, choosenUser.confirmPassword, choosenUser.type,
      choosenUser.date, choosenUser.place, choosenUser.phone, true);
    this.usersSub = this.userService.getUserUpdateListener()
    .subscribe((users: AuthData[]) => {
      this.userService.getUsers();
      // this.users = users;
    });
    }

  reject(username: string): void {
    this.userService.deleteUser(username);
    this.usersSub = this.userService.getUserUpdateListener()
    .subscribe((users: AuthData[]) => {
      this.userService.getUsers(); // dodala naknadno
      this.users = users;
    });
  }
  update(user: User){
    this.userService.updateUser(user.username,user.password,user.name,user.surname,user.email,user.confirmPassword,user.type,user.date,user.place,user.phone,user.approved);
    alert("Succesfully updated user!");
  }
  }
