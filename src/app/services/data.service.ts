import { Injectable } from '@angular/core';
import { Regel } from '../regel';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  uitvoerData: Regel[] = [];
  startKlok = null;
  voornaam: string = "lucas";
  rugzak = ["Thermos kan", "USB-stick", "aansteker"];
  huidigLevel = 2;
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
  muntstukGevonden = true;
  securityGuardAfgeleid = true;
  inLift = true;

  //level2
  vuurAan = false;
  kastOpen = false;
  plantMetWater = false;

  constructor() { }

  public gebruikersInvoer() {
    return this.uitvoerData.filter(t => t.uitvoerder == this.voornaam || t.uitvoerder == null);
  }
}
