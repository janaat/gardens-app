import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from './user';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserserviceService {
  private isAuthenticated = false;
  private isFarmer=false;
  private users: AuthData[] = [];
  private userUpdated = new Subject<AuthData[]>();
  private token: string;
  private authrStatusListener = new Subject<boolean>();
  private authrFarmerStatusListener=new Subject<boolean>();
  private tokenTimer: any;
  private authToApproveStatusListener = new Subject<boolean>();
  private usersToApprove: AuthData[] = [];
  private usersToApproveUpdated = new Subject<AuthData[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getUsers() {
    this.http
      .get<{ message: string; users: any }>('http://localhost:3000/api/user')
      .pipe(
        map((postData) => {
          return postData.users.map((user) => {
            return {
              username: user.username,
              password: user.password,
              name: user.name,
              surname: user.surname,
              email: user.email,
              confirmPassword: user.confirmPassword,
              type: user.type,
              date: user.date,
              place: user.place,
              phone: user.phone,
              approved: user.approved,
            };
          });
        })
      )
      .subscribe((transformedUsers) => {
        this.users = transformedUsers;
        this.userUpdated.next([...this.users]);
      });
  }
  getUsersToApprove() {
    this.http
      .get<{ message: string; users: any }>('http://localhost:3000/api/user')
      .pipe(
        map((postData) => {
          return postData.users.map((user) => {
            return {
              username: user.username,
              password: user.password,
              name: user.name,
              surname: user.surname,
              email: user.email,
              confirmPassword: user.confirmPassword,
              type: user.type,
              date: user.date,
              place: user.place,
              phone: user.phone,
              approved: false,
            };
          });
        })
      )
      .subscribe((transformedUsers) => {
        this.usersToApprove = transformedUsers;
        this.usersToApproveUpdated.next([...this.usersToApprove]);
      });
  }
  getUserUpdateListener() {
    return this.userUpdated.asObservable();
  }
  getUserByUsername(username: string) {
    return this.http.get<{
      username: string;
      password: string;
      name: string;
      surname: string;
      email: string;
      confirmPassword: string;
      place: string;
      phone: string;
      date: Date;
      approved: boolean;
      type: string;
    }>('http://localhost:3000/api/user' + username);
  }
  addUser(
    username: string, // radi djavo ga odneo
    password: string,
    name: string,
    surname: string,
    email: string,
    confirmPassword: string,
    type: string,
    date: Date,
    place: string,
    phone: string,
    approved: boolean
  ) {
    console.log('Usao u adduser u userservice');
    const user: User = {
      username: username,
      password: password,
      name: name,
      surname: surname,
      email: email,
      confirmPassword: confirmPassword,
      phone: phone,
      place: place,
      date: date,
      approved: false,
      type: type,
    };
    if (type === 'admin') {
      user.name = 'Admin';
      user.surname = 'Adminic';
      user.phone = '1234';
      user.place = 'Admingrad';
    }
    console.log('Da li je napravio usera?');
    console.log(user);
    this.http
      .post('http://localhost:3000/api/user/register', user)
      .subscribe((response) => {
        console.log('Usao u subscribe u usersevice za adduser');
        console.log(response);
        this.router.navigate['login'];
        // this.users.push(user);
        // this.usersToApproveUpdated.next([...this.users]);
        // this.router.navigate(['/']);
      });
  }
  updateUser(
    username: string,
    password: string,
    name: string,
    surname: string,
    email: string,
    confirmPassword: string,
    type: string,
    date: Date,
    place: string,
    phone: string,
    approved: boolean
  ) {
    console.log('U user service usao');
    let userData: FormData | AuthData;
    userData = {
      username: username,
      password: password,
      name: name,
      surname: surname,
      email: email,
      confirmPassword: confirmPassword,
      place: place,
      phone: phone,
      date: date,
      type: type,
      approved: approved,
    };
    console.log(userData);
    console.log('Napravio userDatu?');
    this.http.post('http://localhost:3000/api/user/change', userData).subscribe(
      (result) => {
        console.log('Usao u subscribe');
        this.getUsers();
        console.log(this.users);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  changePassword(username: string, oldpassword: string, newpassword: string) {
    this.http
      .post('http://localhost:3000/api/user/changepass', {
        username: username,
        oldpassword: oldpassword,
        newpassword: newpassword,
      })
      .subscribe(
        (result) => {
          this.getUserUpdateListener();
          alert('Password changed!');
        },
        (error) => {
          console.log(error);
        }
      );
  }
  deleteUser(username: string) {
    return this.http
      .post('http://localhost:3000/api/user/delete', { username: username })
      .subscribe((result) => {
        this.getUsers();
      });
  }
  login(username: string, password: string, type: string):string {
    let pom:string="";
    const userData = { username: username, password: password, type: type };
    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        userData
      ).subscribe((response) => {
        if(!response){
          console.log("Nije nasao usera!");
          alert("Incorrect credentials!");
          pom="Incorrect credentials!";
          console.log(pom);
          return pom;
        }
        console.log('Usao u subscribe u userservice za login');
        console.log(response);
        const token = response.token;
        this.token = token;
        console.log('Napravio token');
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          console.log('Postavio isAuthenticated=true');
          this.authrStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate);
          if (type === 'farmer') {
            this.isFarmer=true;
            this.authrFarmerStatusListener.next(true);
            console.log('tip je farmer');
            this.router.navigate(['/farmer']);
            return pom;
          } else if (type === 'admin') {
            console.log('tip je admin');
            this.router.navigate(['/admin']);
          } else if (type === 'company') {
            console.log('tip je company');
            this.router.navigate(['/company']);
          }
        } else { pom="Incorrect"; return pom; }
      }),(error)=>{
        pom="Incorrect";
        console.log(pom);
        return pom;
      }
    return pom;
  }
  returnMessage():string{
    if(1){return ""}
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authrStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  getToken() {
    return this.token;
  }
  getAuthStatusListener() {
    return this.authrStatusListener.asObservable();
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getFarmerStatusListener() {
    return this.authrFarmerStatusListener.asObservable();
  }
  getIsFarmer() {
    return this.isFarmer;
  }
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('exparation', expirationDate.toISOString());
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('exparation');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('exparation');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authrStatusListener.next(true);
    }
  }
}
