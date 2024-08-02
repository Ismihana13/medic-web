import { MojConfig } from '../moj-config';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AutentifikacijaHelper } from '../helper/autentifikacija-helper';
import { Component, OnInit} from "@angular/core";
import Swal from 'sweetalert2';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private router: Router,
    private autentifikacijaHelper: AutentifikacijaHelper
  ) {}

  ngOnInit(): void {
    this.autentifikacijaHelper.loggedInEvent.subscribe((loggedIn: boolean) => {
      this.loggedIn = loggedIn;
    });
    this.loggedIn = this.autentifikacijaHelper.stanjePrijave();
    this.loadKorisnik();

  }

  loadKorisnik() {
    this.httpClient
      .get(
        MojConfig.adresa_servera + `/Autentifikacija/Get`,
        MojConfig.http_opcije()
      )
      .subscribe((x: any) => {
        this.loggedIn = this.autentifikacijaHelper.stanjePrijave();
      });
  }

  odjaviSe() {
    let token = window.localStorage.getItem('my-auth-token') ?? '';
    window.localStorage.setItem('my-auth-token', '');
    let url=MojConfig.adresa_servera + '/Autentifikacija/Logout/logout';
    this.httpClient
      .post(url,{

      },{
        headers:{
          "my-auth-token":token
        }
      })
      //MojConfig.http_opcije()
      .subscribe(() => {
        localStorage.setItem('loggedOut', 'true');
        localStorage.setItem('loggedIn', 'false');
        localStorage.setItem('autentifikacija-token', '');
        this.loggedIn = false;
        Swal.fire({
          title: "Uspješno ste se odjavili",
          icon: "success"
        })
          this.router.navigate(["/login"]);

      });
  }
}
