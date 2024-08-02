import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import {Login} from "./login-vm";
import {AutentifikacijaHelper} from "../helper/autentifikacija-helper";
import {AuthService} from "../services/AuthService";
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  prijava : Login = new Login();
  zapamtiMe : any;
  fieldText:  boolean = false;
  validiranoKorisnickoIme: boolean = false;
  validiranaLozinka : boolean = false;


  constructor(private httpKlijent : HttpClient, private router : Router,private autentifikacijaHelper: AutentifikacijaHelper,
              private authService:AuthService) {
  }

  ngOnInit(): void {
  }

  posaljiPodatke() {
    if (this.validiranoKorisnickoIme && this.validiranaLozinka) {
      this.httpKlijent.post(MojConfig.adresa_servera + '/Autentifikacija/Login/login', this.prijava)
        .subscribe((response: any) => {
          if (response.isLogiran) {
            this.authService.setLogiraniKorisnik(response.autentifikacijaToken);
            if (this.authService.isAdmin()) {
              response.isPermisijaGost = false;
              AutentifikacijaHelper.setLoginInfo(response, this.zapamtiMe);
              localStorage.setItem("loggedIn", "true");
              localStorage.setItem("loggedOut", "false");
              this.autentifikacijaHelper.loggedInEvent.emit(true);
              this.router.navigate(['/']);
              Swal.fire({
                title: "Uspješno ste se logirali!",
                icon: "success"
              });
            } else {
              Swal.fire({
                title: "Pristup zabranjen",
                text: "Samo administratori mogu se prijaviti.",
                icon: "error"
              });
              AutentifikacijaHelper.setLoginInfo(null);
            }
          } else {
            AutentifikacijaHelper.setLoginInfo(null);
            Swal.fire({
              title: "Oops...",
              text: "Pogrešno uneseni podaci za prijavu. Neispravno korisničko ime ili lozinka.",
              icon: "error"
            });
          }
        }, error => {
          console.error('Error occurred:', error);
          Swal.fire({
            title: "Greška",
            text: "Došlo je do greške prilikom prijave. Pokušajte ponovo.",
            icon: "error"
          });
        });
    } else {
      Swal.fire({
        title: "Neadekvatno ispunjena forma za prijavu",
        text: "Molimo ispunite sva obavezna polja, pa ponovo pokušajte.",
        icon: "error"
      });
    }
  }
  prikaziSakrij() {
    this.fieldText = !this.fieldText;
  }

  provjeriKorisnickoIme(polje : any) {
    if (polje.invalid && (polje.dirty || polje.touched)){
      if (polje.errors?.['required']){
        this.validiranoKorisnickoIme = false;
        return 'Niste popunili ovo polje!';
      }
      else {
        this.validiranoKorisnickoIme = true;
        return '';
      }
    }
    if (this.prijava.korisnickoIme != null && this.prijava.korisnickoIme.length > 0) this.validiranoKorisnickoIme = true;
    return 'Obavezno polje za unos';
  }

  provjeriLozinku(polje : any) {
    if (polje.invalid && (polje.dirty || polje.touched)){
      if (polje.errors?.['required']){
        this.validiranaLozinka = false;
        return 'Niste popunili ovo polje!';
      }
      else {
        this.validiranaLozinka = true;
        return '';
      }
    }
    if (this.prijava.lozinka != null && this.prijava.lozinka.length > 0) this.validiranaLozinka = true;
    return 'Obavezno polje za unos';
  }

}
