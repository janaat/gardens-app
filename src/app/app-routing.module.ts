import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './register/register/register.component';
import { ChangepassComponent } from './changepass/changepass.component';
import { AdminComponent } from './admin/admin.component';
import { FarmerComponent } from './farmer/farmer.component';
import { CompanyComponent } from './company/company.component';
import { GardensComponent } from './gardens/gardens.component';
import { ResultsComponent } from './results/results.component';
import { DetailsComponent } from './details/details.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AuthGuard } from './auth.guard';
import { FormsModule } from '@angular/forms';
import { FarmGuard } from './farm.guard';
import { ShopComponent } from './shop/shop.component';


const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'changepass', component: ChangepassComponent},
  {path:'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path:'farmer', component: FarmerComponent, canActivate: [AuthGuard]},
  {path:'company', component: CompanyComponent, canActivate: [AuthGuard]},
  {path:'gardens', component: GardensComponent, canActivate: [AuthGuard]},
  {path:'results', component: ResultsComponent, canActivate: [AuthGuard]},
  {path:'details', component: DetailsComponent, canActivate: [AuthGuard]},
  {path:'productlist', component: ProductListComponent, canActivate: [AuthGuard]},
  {path:'shop',component:ShopComponent,canActivate:[AuthGuard]},
  {path:'',component:LoginComponent}

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, FormsModule],
  providers:[AuthGuard,FarmGuard],
  declarations:[]
})
export class AppRoutingModule { }
