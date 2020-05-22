import { Regel } from './regel';
import * as moment from 'moment';
export class Data {
	uitvoerData: Regel[] = [];
	startKlok = null;
	eindKlok = null;
	voornaam: string = null;
	rugzak = ["Thermoskan", "aansteker"];
	huidigLevel = 0;
	huidigePlaats = "voor de deur";
	downNummer: number = 0;
	_bedragInRugzak: number = 0;
	welkomsBerichtGetoond = false;

	get bedragInRugzak(): number {
		return this._bedragInRugzak;
	}
	set bedragInRugzak(bedrag: number) {
		this._bedragInRugzak = Math.round(bedrag * 100) / 100;
	}
	private _bedragInAutomaat: number = 0;
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
	level2gestart = false;
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
	kluisOpen = false;
	constructor() { }

	public gebruikersInvoer() {
		return this.uitvoerData.filter(t => t.uitvoerder == this.voornaam);
	}

	public static fromJson(json: any): Data {
		var obj = new Data();
		obj.uitvoerData = json.uitvoerData;
		obj.startKlok = moment(json.startKlok);
		obj.eindKlok = moment(json.eindKlok);
		obj.voornaam = json.voornaam;
		obj.rugzak = json.rugzak;
		obj.huidigLevel = json.huidigLevel;
		obj.huidigePlaats = json.huidigePlaats;
		obj.downNummer = json.downNummer;
		obj._bedragInRugzak = json._bedragInRugzak;
		obj._bedragInAutomaat = json._bedragInAutomaat;
		obj.welkomsBerichtGetoond = json.welkomsBerichtGetoond;

		obj.muntstukGevonden = json.muntstukGevonden;
		obj.bewakerAfgeleid = json.bewakerAfgeleid;
		obj.inLift = json.inLift;

		obj.level2gestart = json.level2gestart;
		obj.vuurAan = json.vuurAan;
		obj.kastOpen = json.kastOpen;
		obj.plantMetWater = json.plantMetWater;
		obj.sleutelGenomen = json.sleutelGenomen;
		obj.briefOpen = json.briefOpen;
		obj.lockerCodes = json.lockerCodes;
		obj.laptopBeschikbaar = json.laptopBeschikbaar;
		obj.terugVanLaptop = json.terugVanLaptop;
		obj.soniaIngelogd = json.soniaIngelogd;
		obj.beveilingUitgeschakeld = json.beveilingUitgeschakeld;
		obj.frequentieGeraden = json.frequentieGeraden;
		obj.radioAan = json.radioAan;
		obj.kluisOpen = json.kluisOpen;
		return obj;
	}

}
