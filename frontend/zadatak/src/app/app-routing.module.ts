import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {PocetnaComponent} from "./pocetna/pocetna.component";
import {AutorizacijaLoginProvjera} from "./guards/autorizacija-login-provjera.service";

const routes: Routes = [
  {
    component: LoginComponent,
    path: 'login',
  },
  {
    component: PocetnaComponent,
    path: '',
    canActivate: [AutorizacijaLoginProvjera],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
