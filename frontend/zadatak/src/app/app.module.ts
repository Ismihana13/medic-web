import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter, NativeDateAdapter } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AutorizacijaLoginProvjera } from './guards/autorizacija-login-provjera.service';
import { AutentifikacijaHelper } from './helper/autentifikacija-helper';
import { AuthInterceptor } from './helper/auth/auth-interceptor.service';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { HeaderComponent } from './header/header.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PocetnaComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,  // Correct import for MatDatepickerModule
    MatNativeDateModule,  // Add this for using the NativeDateAdapter
    BsDatepickerModule.forRoot()
  ],
  providers: [
    AutorizacijaLoginProvjera,
    AutentifikacijaHelper,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: DateAdapter, useClass: NativeDateAdapter }, // Provide the DateAdapter
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
