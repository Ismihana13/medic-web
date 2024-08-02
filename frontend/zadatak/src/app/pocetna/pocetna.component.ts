import {Component, OnInit, ViewChild} from '@angular/core';
import { UserService } from '../services/korisnici.service';
import { KorisnickiNalog } from '../helper/korisnicki-nalog';
import {forkJoin, map} from "rxjs";
import {MojConfig} from "../moj-config";
import {HttpClient} from "@angular/common/http";
import Swal from "sweetalert2";

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.css']
})
export class PocetnaComponent implements OnInit {
  korisnici: KorisnickiNalog[] = [];
  datumZadnjePrijave: { [key: number]: Date | null } = {};
  otvori: boolean = false;
  trenutniKorisnik: any;
  noviModal=false;
  noviKorisnik:any={
    korisnickoIme:"",
    lozinka:"",
    ime:"",
    brojNarudzbi:0,
    slika:"",
    datumRodjenja:null,

  }
  constructor(private userService: UserService,private httpKlijent : HttpClient) { }

  ngOnInit(): void {
    this.loadKorisnik();
  }

  loadKorisnik(): void {
    this.userService.getUsers().subscribe((data: KorisnickiNalog[]) => {
      this.korisnici = data;
      const observables = this.korisnici.map(korisnik => {
        return this.userService.getUserLastLogin(korisnik.id!).pipe(
          map(datum => ({ id: korisnik.id, datum }))
        );
      });

      forkJoin(observables).subscribe(results => {
        results.forEach(result => {
          this.datumZadnjePrijave[result.id!] = result.datum;
        });
      });
    });
  }

  otvoriModal(korisnik: KorisnickiNalog) {
    this.otvori = true;
    this.trenutniKorisnik={
      id: korisnik.id,
      ime: korisnik.ime,
      korisnickoIme:korisnik.korisnickoIme,
      slika: korisnik.slika,
      status:korisnik.status,
      datumRodjenja: korisnik.datumRodjenja ? this.formatDate(korisnik.datumRodjenja) : null,
      isBlokiran:korisnik.isBlokiran,
      brojNarudzbi:korisnik.brojNarudzbi,
      readonly: korisnik.isBlokiran
    }
  }

  sacuvajPromjene(trenutniKorisnik: any) {
    this.otvori=false;
    Swal.fire({
      title: 'Potvrda',
      text: 'Da li želite sačuvati izmjene?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Da, sačuvaj',
      cancelButtonText: 'Odustani'
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpKlijent.post(MojConfig.adresa_servera + `/users/update/${trenutniKorisnik.id}`, trenutniKorisnik, MojConfig.http_opcije())
          .subscribe(() => {
            this.otvori = false;
            this.loadKorisnik();
          });
      }
    });
  }
  blokirajOdbokirajKorisnika(korisnik: KorisnickiNalog) {

    const action = korisnik.isBlokiran ? 'odblokirati' : 'blokirati';
    this.otvori=false;
    Swal.fire({

      title: 'Potvrda',
      text: `Da li ste sigurni da želite ${action} korisnika?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Da, ${action}!`,
      cancelButtonText: 'Odustani'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadKorisnik();
        korisnik.isBlokiran = !korisnik.isBlokiran;
        this.trenutniKorisnik.readonly = korisnik.isBlokiran;
        this.sacuvajPromjeneDugmeta(korisnik);

      }
    });
  }
  sacuvajPromjeneDugmeta(trenutniKorisnik: any) {
    this.httpKlijent.post(MojConfig.adresa_servera+ `/users/update/${trenutniKorisnik.id}`,this.trenutniKorisnik, MojConfig.http_opcije()).subscribe((x:any)=> {
      this.loadKorisnik();
    });
  }
  otvoriModalZaNovokKorisnika() {
    this.noviModal=true;
    this.noviKorisnik={
      korisnickoIme:"",
      lozinka:"",
      ime:"",
      brojNarudzbi:0,
      slika:"",
      datumRodjenja:Date.now(),
    }
  }
  dodajNovogKroisnika() {
    this.httpKlijent.post(MojConfig.adresa_servera+ "/users/register", this.noviKorisnik,MojConfig.http_opcije()).subscribe((x:any)=>{
      this.loadKorisnik();
      this.noviModal=false;
    });
  }

   formatDate(datumRodjenja: Date) {
    const d = new Date(datumRodjenja);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
