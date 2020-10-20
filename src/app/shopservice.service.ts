import { Injectable } from '@angular/core';
import { Product } from './Product';
import { Subject, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, count } from 'rxjs/operators';
import { Order } from './Order';
import { NgForm } from '@angular/forms';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root',
})
export class ShopserviceService {
  private products: Product[] = [];
  private productUpdated = new Subject<Product[]>();
  private token: string;
  private productStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private authToApproveStatusListener = new Subject<boolean>();
  private productsToApprove: Product[] = [];
  private productsToApproveUpdated = new Subject<Product[]>();

  private orders: Order[] = [];
  private ordersUpdated = new Subject<Order[]>();
  private orderStatusListener = new Subject<boolean>();
  private orderToApproveStatusListener = new Subject<boolean>();
  private ordersToApprove: Order[] = [];
  private ordersToApproveUpdated = new Subject<Order[]>();

  private deliveryUpdated = new Subject<boolean[]>();
  private deliveryStatusListener = new Subject<boolean>();
  private worker1: boolean = true;
  private worker2: boolean = true;
  private worker3: boolean = true;
  private worker4: boolean = true;
  private worker5: boolean = true;

  sourceDelivery1 = timer(0, 3600);
  sourceDelivery2 = timer(0, 3600);
  sourceDelivery3 = timer(0, 3600);
  sourceDelivery4 = timer(0, 3600);
  sourceDelivery5 = timer(0, 3600);

  constructor(private http: HttpClient, private router: Router) {}
  getProducts() {
    this.http
      .get<{ message: string; products: any }>(
        'http://localhost:3000/api/product'
      )
      .pipe(
        map((postData) => {
          return postData.products.map((product) => {
            return {
              name: product.name,
              type: product.type,
              manufacturer: product.manufacturer,
              quantity: product.quantity,
              available: product.available,
              reviews: product.reviews,
              rating: product.rating,
              progress: product.progress,
              dynamics: product.dynamics
            };
          });
        })
      )
      .subscribe((transformedProducts) => {
        this.products = transformedProducts;
        this.productUpdated.next([...this.products]);
      });
  }
  getProductUpdateListener() {
    return this.productUpdated.asObservable();
  }
  addProduct(name: string, quantity: number, type: string, dynamics: number) {
    console.log('Usao u addproduct u productservice');
    const product: Product = {
      manufacturer: localStorage.getItem('current'),
      name: name,
      type: type,
      quantity: quantity,
      rating: 0,
      available: true,
      reviews: null,
      progress: 0,
      dynamics: dynamics
    };

    console.log('Da li je napravio product?');
    console.log(product);
    this.http
      .post('http://localhost:3000/api/product/addproduct', product)
      .subscribe((response) => {
        console.log('Usao u subscribe u productservice za addproduct');
        console.log(response);
      });
  }
  getProductStatusListener() {
    return this.productStatusListener.asObservable();
  }
  getProductByName(name: string) {
    // let prod: Product;
    // return this.http.get<{name: string}>('http://localhost:3000/api/product/'+name);
    console.log('Usao u getprofuctbyname');
    this.http
      .get<{ message: string; products: any }>(
        'http://localhost:3000/api/product/' + name
      )
      .pipe(
        map((postData) => {
          postData.products.map((product) => {
            const p: Product = {
              name: product.name,
              type: product.type,
              manufacturer: product.manufacturer,
              quantity: product.quantity,
              available: product.available,
              reviews: product.reviews,
              rating: product.rating,
              dynamics: product.dynamics,
              progress: product.progress
            };
          });
        })
      )
      .subscribe((transformedProducts) => {
        let help = transformedProducts;
        // this.products=transformedProducts;
        // this.productUpdated.next([...this.products]);
        console.log(help);
        return help;
      });
  }
  addOrder(user: string, o: Order, dat: Date, form: NgForm) {
    console.log(dat);
    console.log('Usao u addorder u productservice');
    const order: Order = {
      user: o.user,
      products: o.products,
      status: 'Pending',
      date: dat,
      isDelivered: false,
      manufacturer: o.manufacturer,
      garden: o.garden
    };
    console.log('Da li je napravio order?');
    console.log(order);
    this.http
      .post('http://localhost:3000/api/order/addorder', order)
      .subscribe((response) => {
        console.log('Usao u subscribe u shopservice za addorder');
        console.log(response);
      });

  }
  getOrders() {
    this.http
      .get<{ message: string; products: any }>(
        'http://localhost:3000/api/order'
      )
      .pipe(
        map((postData) => {
          return postData.products.map((product) => {
            return {
              user: product.user,
              products: product.products,
              status: product.status,
              isDelivered: product.isDelivered,
              date: product.date,
              manufacturer: product.manufacturer,
              garden: product.garden
            };
          });
        })
      )
      .subscribe((transformedOrders) => {
        this.orders = transformedOrders;
        this.ordersUpdated.next([...this.orders]);
      });
  }
  // getOrdersObjects():Order[]{
  //   return this.http.get<{ message: string; products: any }>('http://localhost:3000/api/order')

  // }
  getOrderUpdateListener() {
    return this.ordersUpdated.asObservable();
  }
  getOrderStatusListener() {
    return this.orderStatusListener.asObservable();
  }
  deleteOrder(o: Order) {
    return this.http
      .post('http://localhost:3000/api/order/delete', { user: o.user, date:o.date })
      .subscribe((result) => {
        this.getOrders();
      });
  }
  removeProduct(p: Product) {

    return this.http
      .post('http://localhost:3000/api/product/delete', { name: p.name, quantity:p.quantity })
      .subscribe((result) => {
        this.getProducts();
      });
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
  async deliverOrder(o:Order){
    this.http.post('http://localhost:3000/api/order/deliver', {user: o.user, date: o.date, status: "In delivery"}) // bilo ,orderData
       .subscribe(
        (result) => {
           console.log('Usao u subscribe');
           this.getOrders();
           console.log(this.orders);
         },
         (error) => {
          console.log(error);
         }
       );
       await this.delay(15000);
       this.setDeliveredStatus(o);

  }
  setDeliveredStatus(o:Order){
    this.http
    .post('http://localhost:3000/api/order/delivered', {user: o.user, date: o.date, status: "Delivered"}) // bilo ,orderData
    .subscribe(
      (result) => {
        console.log('Usao u subscribe');
        this.getOrders();
        console.log(this.orders);
      },
      (error) => {
        console.log(error);
      }
    );


  }
  addToStorage(prod: Product[],garden:String){ // fali za backend logika; kad stigne posiljka, u koji magacin ide
    for(let p of prod){
      this.http.post('http://localhost:3000/api/order/storageupdate',
      {name: p.name,manufacturer:p.manufacturer,type:p.type,quantity:p.quantity,
        progress:p.progress,dynamics:p.dynamics,rating:p.rating,available:p.available,reviews:p.reviews})
      .subscribe((result)=>{
        console.log("Usao u subscribe addtostorage");
        this.getProducts();
        console.log(this.products);
      },
      (error)=>{
        console.log(error);
      });

    }
  }
  countOrders(orders:Order[],counter:number[]):number[]{
    //let pom:Order[]=orders;
    counter.fill(0);
    console.log("USLI SMO U COUNTORDERS U SERVISU");
    let i;
    for(i=0;i<orders.length;i++){
      let dan=orders[i].date.toString().slice(8,10);
      let danBroj=parseInt(dan);
      counter[danBroj+1]++;
    }
    // orders.forEach(element => {
      // let dan=element.date.toString().slice(8,10);
      // let danBroj=parseInt(dan);
      // counter[danBroj+1]++;
    // });
    //console.log(counter);
    return counter;
  }
}
