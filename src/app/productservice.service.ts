import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Product } from './Product';
import { Subject } from 'rxjs';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class ProductserviceService {

  private products: Product[] = [];
  private productUpdated = new Subject<Product[]>();
  private token: string;
  private productStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private authToApproveStatusListener = new Subject<boolean>();
  private productsToApprove: Product[] = [];
  private productsToApproveUpdated = new Subject<Product[]>();

  private storages: Storage[] = [];
  private storageUpdated = new Subject<Storage[]>();
  private storageStatusListener = new Subject<boolean>();
  private storageToApproveStatusListener = new Subject<boolean>();
  private storagesToApprove: Storage[] = [];
  private storagesToApproveUpdated = new Subject<Storage[]>();


  constructor(private http: HttpClient, private router: Router) { }

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
  getProductStatusListener() {
    return this.productStatusListener.asObservable();
  }
  // getProductByName(name: string) {
  //   // let prod: Product;
  //   // return this.http.get<{name: string}>('http://localhost:3000/api/product/'+name);
  //   console.log('Usao u getprofuctbyname');
  //   this.http
  //     .get<{ message: string; products: any }>(
  //       'http://localhost:3000/api/product/' + name
  //     )
  //     .pipe(
  //       map((postData) => {
  //         postData.products.map((product) => {
  //           const p: Product = {
  //             name: product.name,
  //             type: product.type,
  //             manufacturer: product.manufacturer,
  //             quantity: product.quantity,
  //             available: product.available,
  //             reviews: product.reviews,
  //             rating: product.rating,
  //           };
  //         });
  //       })
  //     )
  //     .subscribe((transformedProducts) => {
  //       let help = transformedProducts;
  //       // this.products=transformedProducts;
  //       // this.productUpdated.next([...this.products]);
  //       console.log(help);
  //       return help;
  //     });
  // }

  getProductByNameAndManufacturer(name:string,manufacturer:string){
    return this.http.get<{_id:string, name:string, manufacturer: string, type:string,quantity:number,progress:number,dynamics:number,rating:number,available:boolean,reviews:Array<Object>}>('http://localhost:3000/api/product/'+name);
  }
  addProductToOrder(name:string,manufacturer:string){
    if(!this.http.get<{_id:string,name:string,status:string,products:Array<Product>}>('http://localhost:3000/api/product/'+name)){
      this.http.post('http://localhost:3000/api/product/available',{name: name, manufacturer: manufacturer})
    .subscribe((response) => {
      this.getProducts();
      this.getProductUpdateListener();
      console.log('Usao u subscribe u addproducttoorder u productservice');
      console.log(response);
  })
      alert("The product you have chosen is not available!");
    }
    return this.http.post('http://localhost:3000/api/product/'+name,{name: name, manufacturer: manufacturer})
    .subscribe((response) => {
      this.getProducts();
      this.getProductUpdateListener();
      console.log('Usao u subscribe u addproducttoorder u productservice');
      console.log(response);
  })};

  getStorageByName(name: string) {
    return this.http.get<{_id:string, name: string, status:string, products:Array<Product>}>('http://localhost:3000/api/storage/'+name);
  }
  getStorages() {
    this.http
      .get<{ message: string; storages: any }>(
        'http://localhost:3000/api/storage'
      )
      .pipe(
        map((postData) => {
          return postData.storages.map((storage) => {
            return {
              name: storage.name,
              status: storage.type,
              products: storage.products
            };
          });
        })
      )
      .subscribe((transformedStorages) => {
        this.storages = transformedStorages;
        this.storageUpdated.next([...this.storages]);
      });
  }

  getStorageUpdateListener() {
    return this.storageUpdated.asObservable();
  }
  getStorageStatusListener() {
    return this.storageStatusListener.asObservable();
  }



}
