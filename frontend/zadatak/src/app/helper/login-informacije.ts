
export class LoginInformacije {
  autentifikacijaToken?:        AutentifikacijaToken;
  isLogiran:                   boolean=false;
  isPermisijaKorisnik:         boolean=false;
  isPermsijaAdministrator: boolean=false;
  isPermisijaGost: boolean=false;
}
export interface AutentifikacijaToken {
  id:                   number;
  vrijednost:           string;
  korisnickiNalogId:    number;
  korisnickiNalog:      KorisnickiNalog;
  vrijemeEvidentiranja: Date;
  ipAdresa:             string;
}

export interface KorisnickiNalog {
  id: number
  ime: string
  korisnickoIme: string
  lozinka: string
  slika:string
  isUposlenik: boolean
  isAdministrator: boolean
  status:boolean
  datumRodjenja:Date
  isBlokiran:boolean;
}
