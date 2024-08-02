import {AutentifikacijaToken} from "./helper/login-informacije";
import {AutentifikacijaHelper} from "./helper/autentifikacija-helper";

export class MojConfig{
  static adresa_servera = "https://medic-api-f9fzfvhza8f2hxf6.eastus-01.azurewebsites.net"
  static http_opcije = function () {
    let autentifikacijaToken: AutentifikacijaToken | undefined = AutentifikacijaHelper.getLoginInfo().autentifikacijaToken;
    let mojtoken = "";

    if (autentifikacijaToken !== undefined) {
      mojtoken = autentifikacijaToken.vrijednost;
    }
    return {
      headers: {
        'autentifikacija-token': mojtoken,
      }
    };
  }

}
