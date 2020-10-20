import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { StringifyOptions } from 'querystring';
import { UserserviceService } from 'src/app/userservice.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import {mimeType} from './mime-type.validator';
import { AuthData } from 'src/app/auth-data.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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
  user: AuthData;
  loading=false;
  isSubmitted=false;
  registerForm:FormGroup;
  userStatusSub: Subscription;

  constructor(private route: ActivatedRoute, public userService: UserserviceService, private router: Router) { }

  ngOnInit(): void {
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
      alert("User successfully added!");
   this.router.navigate['login'];
  }
  ngOnDestroy(){
    this.userStatusSub.unsubscribe();
  }
  public resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

}
