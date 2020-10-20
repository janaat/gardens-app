import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Garden } from './Garden';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './Product';
import { local } from 'd3';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root',
})
export class GardenserviceService {
  private email: string;
  private isFarmer = false;
  private gardens: Garden[] = [];
  private gardenUpdated = new Subject<Garden[]>();
  private token: string;
  private gardenStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private authToApproveStatusListener = new Subject<boolean>();
  private gardensToApprove: Garden[] = [];
  private gardensToApproveUpdated = new Subject<Garden[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getGardens() {
    this.http
      .get<{ message: string; gardens: any }>(
        'http://localhost:3000/api/garden'
      )
      .pipe(
        map((postData) => {
          return postData.gardens.map((garden) => {
            return {
              username: garden.username,
              place: garden.place,
              name: garden.name,
              used: garden.used,
              free: garden.free,
              water: garden.water,
              temperature: garden.temperature,
              products: garden.products,
              x: garden.x,
              y:garden.y
            };
          });
        })
      )
      .subscribe((transformedGardens) => {
        this.gardens = transformedGardens;
        this.gardenUpdated.next([...this.gardens]);
      });
  }
  getGardenUpdateListener() {
    return this.gardenUpdated.asObservable();
  }
  addGarden(username:string, name: string, place: string, x: number, y: number, gardenName:string) {
    console.log('Usao u addgarden u gardenservice');
    const planti: Product[] = [{
      name: "Welcome plant",
      manufacturer: "kompanija",
      type: "plant",
      quantity: 5,
      reviews: null,
      available: true,
      rating: 0,
      progress:40,
      dynamics:0.2
    }];
    const garden: Garden = {
      username: username,
      place: place,
      name: name,
      used: 1,
      free: x * y-1,
      water: 200,
      temperature: 18,
      products: planti,
      storage: gardenName,
      x:x,
      y:y

    };

    console.log('Da li je napravio garden?');
    console.log(garden);
    this.http
      .post('http://localhost:3000/api/garden/addgarden', garden)
      .subscribe((response) => {
        console.log('Usao u subscribe u usersevice za adduser');
        console.log(response);
        // this.users.push(user);
        // this.usersToApproveUpdated.next([...this.users]);
        // this.router.navigate(['/']);
      });
  }
  addWater(nam: string) {
    console.log(nam);
    this.http
      .post('http://localhost:3000/api/garden/water', { name: nam })
      .subscribe(
        (result) => {
          this.getGardenUpdateListener();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  choosePlants(all:Product[]):Product[]{
    let p:number=-1;
    all.forEach((element,index) => {
      if(element.type!=='plant') {p=all.indexOf(element);
      if(p!==-1) all.splice(index,1);
    }});
    return all;
  }
  addTemperature(nam: string) {
    console.log('Usao u servisu u addtemp');
    console.log(nam);
    this.http
      .post('http://localhost:3000/api/garden/temperature', { name: nam })
      .subscribe(
        (result) => {
          console.log('Subscribe se');
          this.getGardenUpdateListener();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  deleteUser(name: string) {
    return this.http
      .post('http://localhost:3000/api/garden/delete', { username: name })
      .subscribe((result) => {
        this.getGardens();
      });
  }
  getGardenStatusListener() {
    return this.gardenStatusListener.asObservable();
  }
  check() {
    if (localStorage.getItem('type') == 'farmer') {
      this.isFarmer = true;
      return true;
    } else {
      this.isFarmer = false;
      return false;
    }
  }

  getIsFarmer() {
    return this.isFarmer;
  }
  changing() {}
  getGardenByName(name: string) {
    return this.http.get<{_id:string, name: string, place: string, username: string, free:number, used: number, water: number, temperature:number,storage:string,products:Array<Product>,x:number,y:number}>('http://localhost:3000/api/garden/'+name);
  }
  takeOut(name: string, products:Product[]){
    this.http.post('http://localhost:3000/api/garden/takeout',{name: name,products:products}).subscribe(
      (result)=>{
        this.getGardenUpdateListener();
        },(error)=>{
          console.log(error);
        });
  }
  getFertilizers(storage:string){
    return this.http.get<{_id:string,name:string,manufacturer:string,dynamics:number}>('http://localhost:3000/api/garden/getfert'+storage);
  }
  fertilize(){
  }
  decrease() {
    this.http.post('http://localhost:3000/api/garden/decr',{}).subscribe(
      (result) => {
        console.log("Usao u subscribe u gardenservice");
        this.getGardenUpdateListener();
      },
      (error) => {
        console.log("Usao u error u gardenservice");
        console.log(error);
      }
    );
    // this.http.post('http://localhost:3000/api/garden/water',{}).subscribe(
    //   (result) => {
    //     this.getGardenUpdateListener();
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }
  // checkYourGarden(){
  //   if(water<18) {
  //     var mailOptions = {
  //       from: 'tomovicj17@gmail.com',
  //       to: 'myfriend@yahoo.com',
  //       subject: 'Sending Email using Node.js',
  //       text: 'That was easy!'
  //     };
  //   }
  // }
  getProductDetails() {}

  plant(name:string,p: Product,prods:Product[]){
    let products:Product[]=prods;
    products.push(p);
    console.log(products);
    this.http.post('http://localhost:3000/api/garden/plant',{name:name, products:products}).subscribe(
      (result)=>{
        this.getGardenUpdateListener();
        console.log(result);
      },
      (error)=>{
        console.log(error);
      }
    );
    products.forEach(element => {
      if(element.name===p.name){
        element.quantity--;
      }
    });
    this.http.post('http://localhost:3000/api/storage/planting',{name:name,p:p}).subscribe(
      (result)=>{
        this.getGardenUpdateListener();
      },
      (error)=>{
        console.log(error);
      }
    );
  }
  addbasic(name:string):number{
    console.log('Usao u addbasic u gardenservice');
    const products1: Product[] = [{
      name: "Plant",
      manufacturer: "kompanija",
      type: "plant",
      quantity: 25,
      reviews: null,
      available: true,
      rating: 0,
      progress:0,
      dynamics:0.2
    },
    {
      name: "Fert",
      manufacturer: "kompanija",
      type: "fertilizer",
      quantity: 25,
      reviews: null,
      available: true,
      rating: 0,
      progress:0,
      dynamics:0.1
    }];

    this.http
      .post('http://localhost:3000/api/storage/addbasictostorage', {name:name, products1:products1})
      .subscribe((response) => {
        console.log('Usao u subscribe u usersevice za adduser');
        console.log(response);
        // this.users.push(user);
        // this.usersToApproveUpdated.next([...this.users]);
        // this.router.navigate(['/']);
      });
      return 1;
  }
}
