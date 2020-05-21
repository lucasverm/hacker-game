import { Injectable } from '@angular/core';
import { Regel } from '../regel';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  uitvoerData: Regel[] = [];
  startKlok = null;
  eindKlok = null;
  voornaam: string = null;
  rugzak = ["Thermoskan", "aansteker"];
  huidigLevel = 0;
  huidigePlaats = "voor de deur";
  downNummer: number = 0;
  _bedragInRugzak = 0;

  get bedragInRugzak(): number {
    return this._bedragInRugzak;
  }
  set bedragInRugzak(bedrag: number) {
    this._bedragInRugzak = Math.round(bedrag * 100) / 100;
  }
  private _bedragInAutomaat = 0;
  get bedragInAutomaat(): number {
    return this._bedragInAutomaat;
  }
  set bedragInAutomaat(bedrag: number) {
    this._bedragInAutomaat = Math.round(bedrag * 100) / 100;
  }

  //level1
  muntstukGevonden = false;
  bewakerAfgeleid = false;
  inLift = false;


  //level2
  vuurAan = false;
  kastOpen = false;
  plantMetWater = false;
  sleutelGenomen = false;
  briefOpen = false;
  lockerCodes = ["xxx", "xxx", "xxx"];
  laptopBeschikbaar: boolean = false;
  terugVanLaptop = false;
  soniaIngelogd = false;
  beveilingUitgeschakeld: boolean = false;
  frequentieGeraden = false;
  radioAan = true;

  constructor() { }

  public gebruikersInvoer() {
    return this.uitvoerData.filter(t => t.uitvoerder == this.voornaam || t.uitvoerder == null);
  }
}
