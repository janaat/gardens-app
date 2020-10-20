import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Order } from './Order';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  private isFarmer = false;
  private orders: Order[]=[];
  private orderUpdated = new Subject<Order[]>();
  private token: string;
  private orderStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private orderToApproveStatusListener= new Subject<boolean>();
  private ordersToApprove: Order[]=[];
  private ordersToApproveUpdated = new Subject<Order[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getOrders(){
    let current=localStorage.getItem('current');
    this.http.get<{message: string; orders: any}>('http://localhost:3000/api/order').pipe(map(postData => {
    return postData.orders.map(order=>{
      return {
        user: order.user,
        name: order.name,
        manufacturer: order.manufacturer,
        status: order.status,
        quantity: order.quantity,
        available: order.available,
        rating: order.rating,
        comment: order.comment
      };
    });
  }))
  .subscribe(transformedOrders=>{
    this.orders=transformedOrders;
    this.orderUpdated.next([...this.orders]);
  })
  }
  getOrderUpdateListener() {
    return this.orderUpdated.asObservable();
  }
  // addOrder(name: string,manufacturer: string, quantity: number){
  //   console.log("Usao u addgarden u gardenservice")
  //   const garden: Order={
  //     user: localStorage.getItem('current'),
  //     products.name: name,

  //     };

  //   console.log("Da li je napravio garden?");
  //   console.log(garden);
  //   this.http.post('http://localhost:3000/api/garden/addgarden', garden)
  // .subscribe( response => {
  //   console.log("Usao u subscribe u usersevice za adduser");
  //   console.log(response);
  //   // this.users.push(user);
  //   // this.usersToApproveUpdated.next([...this.users]);
  //   // this.router.navigate(['/']);
  // }
  // )};




}
