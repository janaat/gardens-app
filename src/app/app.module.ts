import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule, MatDatepickerToggle} from '@angular/material/datepicker';
import { MatNativeDateModule, MatPseudoCheckboxModule } from '@angular/material/core';
import {MatHeaderRow} from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { Ng2SearchPipeModule } from 'ng2-search-filter';

//import {MdButtonModule, MdCheckboxModule} from '@angular/material';
import {MatGridList, MatGridListModule} from '@angular/material/grid-list';

import { EventEmitter } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './register/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { ChangepassComponent } from './changepass/changepass.component';
import { AdminComponent } from './admin/admin.component';
import { FarmerComponent } from './farmer/farmer.component';
import { CompanyComponent } from './company/company.component';
import { ProductListComponent } from './product-list/product-list.component';
import { DetailsComponent } from './details/details.component';
import { ResultsComponent } from './results/results.component';
import { GardensComponent } from './gardens/gardens.component';
import { ErrorComponent } from './error/error.component';
import { ShopComponent } from './shop/shop.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
import { ProductFilterPipe } from './shop/product-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    ChangepassComponent,
    AdminComponent,
    FarmerComponent,
    CompanyComponent,
    ProductListComponent,
    DetailsComponent,
    ResultsComponent,
    GardensComponent,
    ErrorComponent,
    ShopComponent,
    ProductFilterPipe
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatPseudoCheckboxModule,
    MatGridListModule,
    MatProgressBarModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
