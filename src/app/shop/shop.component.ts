import { Component, OnInit } from '@angular/core';
import { Product } from '../Product';
import { Subject, Subscription } from 'rxjs';
import { ShopserviceService } from '../shopservice.service';
import { ThrowStmt } from '@angular/compiler';
import { Order } from '../Order';
import { ProductserviceService } from '../productservice.service';
import { GardenserviceService } from '../gardenservice.service';
import { Garden } from '../Garden';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  orders: Order[] = [];
  loading: false;
  searchText;
  user: string;
  order: Order;
  pomoc: Product;
  help: Product[] = [];
  current: String;
  name: string;
  isDelivered: boolean = false;
  garden: string;
  //shoppingList=new Subject<String[]>();
  shoppingList: string;
  productStatusSub: Subscription;
  private productSub: Subscription;

  gardens: Garden[]=[];

  orderStatusSub: Subscription;
  private orderSub: Subscription;
  ordersSub: Subscription;
  constructor(private shopService: ShopserviceService, private productService: ProductserviceService, private gardenService: GardenserviceService) {}

  ngOnInit(): void {
    this.order = new Order();
    this.shoppingList = '';
    this.shopService.getProducts();
    this.productSub = this.shopService
      .getProductUpdateListener()
      .subscribe((products: Product[]) => {
        this.products = products;
      });
    this.productStatusSub = this.shopService
      .getProductUpdateListener()
      .subscribe((productStatus) => {
        this.loading = false;
      });
    this.order.user = localStorage.getItem('current');
    this.user = '';

    //sad za order
    this.shopService.getOrders();
    this.orderSub = this.shopService
      .getOrderUpdateListener()
      .subscribe((orders: Order[]) => {
        this.orders = orders;
      });
    this.orderStatusSub = this.shopService
      .getOrderStatusListener()
      .subscribe((orderStatus) => {
        this.loading = false;
      });

    this.current = localStorage.getItem('current');
    this.name=localStorage.getItem('current');
    // sad da se nadju svi gardeni

    this.gardenService.getGardenUpdateListener()
    .subscribe((gardens: Garden[])=>{
      this.gardens=gardens;
    })
  }
  add(p: Product) {
    console.log('Usao u add u component.ts');
    console.log(p);
    this.help.push(p);
    console.log("Spisak je:");
    console.log(this.help);
    this.order.products = this.help;
    console.log(this.order.products);
    this.productService.addProductToOrder(p.name,p.manufacturer);
    if (this.shoppingList == '') {
      this.shoppingList += p.name+' from '+p.manufacturer;
    } else {
      this.shoppingList += ', ' + p.name+' from '+p.manufacturer;
    }
    alert('Adding product to the shopping list');
    //this.order.products.push(p);
    console.log(this.order);
    this.orderSub = this.productService.getProductUpdateListener()
    .subscribe((products: Product[]) => {
      //this.productService.getProducts();
      this.products=products;
    });
  }
  details(p: Product) {
    alert('Ulazi u detalje za proizvod');
  }
  buy(form: NgForm) {
    const now = new Date();

    console.log(now);
    if (this.shoppingList == '') {
      alert('Your shopping cart is empty!');
      return;
    } else {
      this.user = localStorage.getItem('current');
      this.shopService.addOrder(this.user, this.order, now, form);
      this.shopService.getOrders();
      this.orderSub = this.shopService
      .getOrderUpdateListener()
      .subscribe((orders: Order[]) => {
        this.orders = orders;
        if(orders){this.ngOnInit();}
      });
      alert('Order successfully sent!');
      this.shoppingList = '';
    }
    this.ngOnInit();
  }

  cancel(o: Order) {
    if (o.status !== 'Pending') {
      this.isDelivered = true;
      alert('Cannot cancel in delivery/delivered order!');
      return;
    }
    this.shopService.deleteOrder(o);
    alert('Order successfully cancelled!');
  }
}
