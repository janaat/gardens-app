import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GardenserviceService } from '../gardenservice.service';
import { Garden } from '../Garden';
import { Storage } from '../Storage';
import { Product } from '../Product';
import { Subscription } from 'rxjs';
import { ProductserviceService } from '../productservice.service';
import { Sort } from '@angular/material/sort';
import { local } from 'd3';

@Component({
  selector: 'app-gardens',
  templateUrl: './gardens.component.html',
  styleUrls: ['./gardens.component.css'],
})
export class GardensComponent implements OnInit {
  name: string; // naziv trenutne baste
  current: Garden;  // trenutna basta
  water: number;
  temperature: number;
  storageName: string; // naziv magacina
  productStatusSub: Subscription;
  storageStatusSub: Subscription;
  productSub: Subscription;
  storageSub: Subscription;
  loading: boolean;

  sortedData: Product[]=[];

  planted: Product[] = [];
  displayedColumns: string[] = ['name', 'manufacturer', 'type', 'quantity'];
  fertilizers: Product[] = []; // neiskorisceno !!!!!!!!!!!!!!
  storage: Storage; // magacin
  temp: Product=new Product(); // trenutno obelezena sadnica
  visible: boolean = false; // da li je vidljiv DIV sa info o sadnicama
  fertilizatorsVisible:boolean=false; // da li je vidljiv DIV sa spiskom fertilizatora

  //source=timer(0,3600000); //3600000
  constructor(
    private route: ActivatedRoute,
    private gardenService: GardenserviceService,
    private productService: ProductserviceService
  ) {
  }

  ngOnInit(): void {

    localStorage.setItem("type","farmer");

    this.temp.name='';
    this.temp.manufacturer='';
    this.temp.progress=0;
    this.temp.available=true;
    this.temp.dynamics=0;
    this.temp.quantity=0;
    this.temp.rating=0;
    this.temp.reviews=null;
    this.temp.type='';

    this.storageStatusSub = this.productService
      .getStorageStatusListener()
      .subscribe((storageStatus) => {
        this.loading = false;
      });
    this.productStatusSub = this.productService
      .getProductStatusListener()
      .subscribe((storageStatus) => {
        this.loading = false;
      });
    this.name = localStorage.getItem('currentGarden'); //localStorage dodelimo naziv baste
    this.gardenService.getGardenByName(this.name).subscribe((gardenData) => {
      console.log('U component.ts ispisujem garden datu');
      console.log(gardenData);
      const curr = {
        username: gardenData.username,
        name: gardenData.name,
        place: gardenData.place,
        used: gardenData.used,
        free: gardenData.free,
        water: gardenData.water,
        temperature: gardenData.temperature,
        storage: gardenData.storage,
        products: gardenData.products,
        x:gardenData.x,
        y:gardenData.y
      };

      this.current = curr;
      this.gardenService.getGardenUpdateListener();
    });
    this.productService.getStorageByName(this.name).subscribe((storageData) => {
      const stor = {
        status: storageData.status,
        name: storageData.name,
        products: storageData.products,
      };
      this.storage = stor;
      console.log("DImenzija x");
      console.log(this.current.x);
    });
    this.productSub=this.productService.getProductUpdateListener().subscribe(producti=>{
      this.sortedData=this.storage.products.slice();
      this.storage.products=producti;
    })
    this.planted=this.gardenService.choosePlants(this.current.products);
  }
  addTemperature() {
    console.log('usao addtemperature');
    this.gardenService.addTemperature(this.name);
    console.log('izasao addtemperature');
    alert('You added 1 degree Celsius to your garden!');
  }
  addWater() {
    console.log('usao addwater');
    this.gardenService.addWater(this.name);
    console.log('izasao addwater');
    alert('You added 1 liter of water to your garden!');
  }
  details(p: Product) {}
  mouseEnter(p: Product) {
    this.visible = true;
    console.log('mouse enter : ');
    this.temp=p;
    // this.temp.name=p.name;
    // this.temp.manufacturer=p.manufacturer;
    // this.temp.progress=p.progress;
    // this.temp.available=p.available;
    // this.temp.dynamics=p.dynamics;
    // this.temp.quantity=p.quantity;
    // this.temp.rating=p.rating;
    // this.temp.reviews=p.reviews;
    // this.temp.type=p.type;
    console.log(this.temp);
    let ind=this.current.products.indexOf(this.temp,0);
    console.log(ind);
  }
  mouseLeave(p: Product) {
    this.visible = false;
    console.log('mouse leave :');
    console.log(this.temp);
    let ind=this.current.products.indexOf(this.temp,0);
    console.log(ind);
  }
  takeOut(){
    let ind = this.current.products.indexOf(this.temp);
    console.log("Indeks je");
    console.log(ind);
    this.current.products.splice(ind,1);//slice(ind,1);
    this.gardenService.takeOut(this.current.name,this.current.products);
  }
  fertilize(p: Product){
    this.fertilizatorsVisible=true;
    this.gardenService.getFertilizers(this.storageName);
  }
  use(p:Product){
    p.available=false;
  }
  putIn(){

  }
  toInt(str: any): number{
    return this.toInt(str);
  }
  plant(p:Product){

    if(this.current.free<=0){
      alert("Your garden is full!"); return;
    }
    console.log(p);
    this.gardenService.plant(this.name,p,this.current.products);
  }
  compare(a: number | String, b: number | String, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortData(sort: Sort) {
    const data = this.storage.products.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'manufacturer': return this.compare(a.manufacturer, b.manufacturer, isAsc);
        case 'quantity': return this.compare(a.quantity, b.quantity, isAsc);
        case 'type': return this.compare(a.type, b.type, isAsc);
        default: return 0;
      }
    });
  }
  addbasic(){
    let pom:number=0;
    pom=this.gardenService.addbasic(this.current.name);
    this.productSub = this.productService.getProductUpdateListener()
    .subscribe((products: Product[]) => {
      this.productService.getProducts();
      if(products) this.ngOnInit();
      });
      if(pom) { this.ngOnInit();}
  }

}
