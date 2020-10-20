import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { AuthData } from '../auth-data.model';
import { Subscription, timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ShopserviceService } from '../shopservice.service';
import { Product } from '../Product';
import { DeliveryService } from '../delivery.service';
import { Order } from '../Order';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  name: String;
  manufacturer: string;
  quantity: number;
  dynamics: number;
  type: string;
  current: string;
  orders: Order[]=[];
  sortedData: Order[]=[];
  orderStatusSub: Subscription;
  private orderSub: Subscription;
  brojac:number[]=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];

  products: Product[]=[];
  form: FormGroup;
  user: AuthData;
  loading=false;
  isSubmitted=false;
  registerForm:FormGroup;
  productStatusSub: Subscription;
  private productSub: Subscription;
  i: number;
  subscribe;

  counterSub: Subscription;

  counter: number[]=new Array<number>();

  busBoy:number=5;
  busBoySub: Subscription;

  worker1: boolean=true;
  worker2: boolean=true;
  worker3: boolean=true;
  worker4: boolean=true;
  worker5: boolean=true;


  sourceDelivery=timer(0,7200);

  constructor(private route: ActivatedRoute, public shopService: ShopserviceService, public deliveryService: DeliveryService) {
    this.sortedData=this.orders.slice();
    for(this.i=0;this.i<30;this.i++){
      this.counter[this.i]=0;}
    //   this.counter.fill(0);
    this.countOrders();
   }
  ngOnInit(): void {
    this.productStatusSub = this.shopService.getProductStatusListener().
    subscribe(userStatus =>{
      this.loading=false;
    })
    this.shopService.getProducts();
    this.productSub=this.shopService.getProductUpdateListener()
    .subscribe((products: Product[])=>{
      this.products=products;
    });
    this.deliveryService.setWorkers();

    // sad za order
    this.shopService.getOrders();
    this.orderSub=this.shopService.getOrderUpdateListener()
    .subscribe((orders:Order[])=>{
      this.orders=orders;
      this.sortedData=this.orders.slice();
    });
    this.orderStatusSub=this.shopService
    .getOrderStatusListener()
    .subscribe((orderStatus)=>{
      this.loading=false;
    });

    // daj ime korisniku u sesiji
    this.current=localStorage.getItem('current');
    //this.name=localStorage.getItem('current');
  }
  details(p: Product) {
    alert('Details for this product!');
  }
  ngOnDestroy(){
    this.productStatusSub.unsubscribe();
  }
  addProduct(form: NgForm){
    if(form.invalid) return;
    this.loading=true;
    this.shopService.addProduct(form.value.name, form.value.quantity, form.value.type, form.value.dynamics);
    this.loading=false;
    this.productSub=this.shopService.getProductUpdateListener()
    .subscribe((products: Product[])=>{
      this.products=products;
    });
    alert("Product successfully added!");
    form.reset();
    this.ngOnInit();

  }
  makeBusy(val: number){
    this.shopService.deliverOrder
    switch(val){
      case 1: {this.worker1=false;
          this.subscribe = this.sourceDelivery.subscribe(val => {this.worker1=true; console.log(val);});
          break;
    }
    case 2:{
      this.worker2=false;
          this.subscribe = this.sourceDelivery.subscribe(val => {this.worker2=true; console.log(val);});
          break;
    }
    case 3:{
      this.worker3=false;
      this.subscribe = this.sourceDelivery.subscribe(val => {this.worker3=true; console.log(val);});
      break;
    }
    case 4:{
      this.worker4=false;
          this.subscribe = this.sourceDelivery.subscribe(val => {this.worker4=true; console.log(val);});
          break;
    }
    case 5:{
      this.worker5=false;
      this.subscribe = this.sourceDelivery.subscribe(val => {this.worker5=true; console.log(val);});
      break;
    }
    default:{
      console.log("Nema takvih smor")
    }
    }
  }
  async deliver(o: Order){
    if(this.busBoy<1) alert("All bus boys are busy!");
    console.log(o.date);
    let i: string=o.date.toString().slice(8,10);
    let iterator:number=parseInt(i);
    this.busBoy--;
    this.shopService.deliverOrder(o);
    await this.shopService.delay(15000);
    this.busBoy++;
    this.shopService.addToStorage(o.products,o.user); // nije uradjen backend
    this.counter[iterator]++;
  }
  reject(o: Order){
    this.shopService.deleteOrder(o);
    this.orderSub=this.shopService.getOrderUpdateListener()
    .subscribe((orders: Order[])=>{
      this.shopService.getOrders();
      this.orders=orders;
    });
  }
  countOrders(){
    console.log(this.orders);
    this.counter=this.shopService.countOrders(this.orders,this.counter);
  }
  refresh(){
    this.countOrders();
  }
  compare(a: number | String, b: number | String, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortData(sort: Sort) {
    const data = this.orders.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'user': return this.compare(a.user, b.user, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }
  generateDataForChart(){
    //let cnt1, cnt2, cnt3, cnt4, cnt5,cnt6, cnt7, cnt8, cnt9, cnt10, cnt11, cnt12, cnt13, cnt14, cnt15, cnt16, cnt17, cnt18, cnt19, cnt20, cnt21, cnt22, cnt23, cnt24, cnt25, cnt26, cnt27, cnt28, cnt29, cnt30;
    let pom=1;
    for(let o of this.orders){
      if(o.date.getDay()===pom) {this.counter[o.date.getDay()-1]++;pom++;}
    }
  }
  removeProduct(p:Product){
    this.shopService.removeProduct(p);
    this.productSub=this.shopService.getProductUpdateListener()
    .subscribe((products: Product[])=>{
      this.shopService.getProducts();
      this.products=products;
    });
  }
}
