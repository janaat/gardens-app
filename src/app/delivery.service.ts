import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { Product } from './Product';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private deliveryUpdated = new Subject<boolean[]>();
  private deliveryStatusListener = new Subject<boolean>();
  private worker1: boolean=true;
  private worker2: boolean=true;
  private worker3: boolean=true;
  private worker4: boolean=true;
  private worker5: boolean=true;

  sourceDelivery1=timer(0,3600);
  sourceDelivery2=timer(0,3600);
  sourceDelivery3=timer(0,3600);
  sourceDelivery4=timer(0,3600);
  sourceDelivery5=timer(0,3600);



  constructor(private http: HttpClient, private router: Router) { }
  setWorkers(){
    console.log("Set all workers to be available:");
     this.worker1=true;
     this.worker2=true;
     this.worker3=true;
     this.worker4=true;
     this.worker5=true;
    console.log(this.worker1+'znaci da je slobodan');

  }
  release(workerID: number){

    if(workerID==1){
      let subscribe = this.sourceDelivery1.subscribe(val => {this.worker1=true; /*this.ping(workerID);*/ console.log(val);});
    }else if(workerID==2){
      let subscribe = this.sourceDelivery2.subscribe(val => {this.worker2=true; console.log(val);});
    }else if(workerID==3){
      let subscribe = this.sourceDelivery3.subscribe(val => {this.worker3=true; console.log(val);});
    }else if(workerID==4){
      let subscribe = this.sourceDelivery4.subscribe(val => {this.worker4=true; console.log(val);});
    }else if(workerID==5){
      let subscribe = this.sourceDelivery5.subscribe(val => {this.worker5=true; console.log(val);});
    }
}
  // ping(val:number){

  // }
  makeBusy(val: number){
    switch(val){
      case 1:{this.worker1=false; this.release(1);break;}
      case 2:{this.worker2=false; this.release(2);break;}
      case 3:{this.worker3=false; this.release(3);break;}
      case 4:{this.worker4=false; this.release(4);break;}
      case 5:{this.worker5=false; this.release(5);break;}
      default: { alert("All delivery guys are busy!"); //uvesti pending na order
                  console.log("All delivery guys are busy!");
  }
    }
    // if(this.worker1){
    //   this.worker1=false;
    //   this.release(1);
    // }else if(this.worker2){
    //   this.worker2=false;
    //   this.release(2);
    // }else if(this.worker3){
    //   this.worker3=false;
    //   this.release(3);
    // }else if(this.worker4){
    //   this.worker4=false;
    //   this.release(4);
    // }else if(this.worker5){
    //   this.worker5=false;
    //   this.release(5);
    // }else{
    //   alert("All delivery guys are busy!");
    //   // uvesti pending na order
    //   console.log("All delivery guys are busy!");
    // }
  }
getDeliveryUpdateListener() {
  return this.deliveryUpdated.asObservable();
}
getDeliveryStatusListener(){
  return this.deliveryStatusListener.asObservable();
}

}
