import { Component, OnInit } from '@angular/core';
import { Garden } from '../Garden';
import { Subject, Subscription } from 'rxjs';
import { NgForm, FormGroup } from '@angular/forms';
import { GardenserviceService } from '../gardenservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import {ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { local } from 'd3';

// export interface GardenInt{
//   name: string;
//   place: string;
//   used: number;
//   free: number;
//   water: number;
//   temperature: number;
// }

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.css']
})
export class FarmerComponent implements OnInit {
  username: string;
  gardens: Garden[]=[];
  name: string;
  place: string;
  x:number;
  y:number;
  form: FormGroup;
  gardensN: Garden;
  loading=false;
  isSubmitted=false;
  registerForm:FormGroup;
  gardenStatusSub: Subscription;
  private gardenSub: Subscription;

  gardenName: string;

  displayedColumns: string[] = ['Name', 'Place', 'Used', 'Free', 'Water', 'Temperature', 'Learn more'];
  dataSource;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private route: ActivatedRoute,private gardenService: GardenserviceService, private router: Router) { }

  ngOnInit(): void {
    this.username=localStorage.getItem('current');
    this.gardenService.getGardens();
    this.gardenSub = this.gardenService.getGardenUpdateListener()
    .subscribe((gardens: Garden[]) => {
      this.gardens = gardens;
    });
    this.gardenStatusSub = this.gardenService.getGardenUpdateListener().
    subscribe(gardenStatus =>{
      this.loading=false;
    })
      this.dataSource = new MatTableDataSource(this.gardens);

    this.dataSource.sort = this.sort;
  }

  enter(gard: Garden){
    localStorage.setItem('currentGarden',gard.name);
    this.router.navigate(['/gardens']);
    alert("You're entering the "+gard.name);
  }

  ngOnDestroy(){
    this.gardenStatusSub.unsubscribe();
  }

  addGarden(form: NgForm){
    if(!form) return;
    this.loading=true;
    this.gardenName=localStorage.getItem("currentGarden");
    this.gardenService.addGarden(this.username,form.value.name, form.value.place, form.value.x, form.value.y,form.value.name);
    form.reset();
    this.gardenSub = this.gardenService.getGardenUpdateListener()
    .subscribe((gardens: Garden[]) => {
      this.gardenService.getGardens();
      });
    this.ngOnInit();
  }
}
