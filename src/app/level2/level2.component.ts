import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Regel } from '../regel';
import { DataService } from '../services/data.service';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';
import * as moment from 'moment';
import { Data } from '../data';

@Component({
  selector: 'app-level2',
  templateUrl: './level2.component.html',
  styleUrls: ['./level2.component.scss']
})
export class Level2Component implements OnInit {
  public inputForm: FormGroup;
  data: Data;
  audioMorse = new Audio();
  audioZoeken = new Audio();

  constructor(public router: Router, private fb: FormBuilder, public dataService: DataService) {
    this.audioMorse.src = "../../assets/morse.mp3";
    this.audioMorse.loop = true;
    this.audioMorse.load();
    this.audioZoeken.src = "../../assets/zoeken.mp3";
    this.audioZoeken.loop = true;
    this.audioZoeken.load();
  }

  ngOnInit() {
    this.dataService.dataObserver$.subscribe(item => {
      this.data = item;
    });
    this.inputForm = this.fb.group({
      input: [""]
    });

    if (!this.data.level2gestart) {
      this.data.huidigePlaats = "bureau";
      this.spel("ga binnen");
      this.data.level2gestart = true;
      this.updateData();
    } else if (this.data.terugVanLaptop) {
      this.level2("");
    }


  }

  ngAfterViewInit() {
    document.getElementById("input").focus();
  }

  updateData() {
    this.dataService.updateData(this.data);
    this.dataService.dataObserver$.subscribe(item => {
      this.data = item;
    }
    )
  }

  getLocatie() {
    if (this.data.huidigePlaats == "bureau") {
      return `${this.data.huidigePlaats}`
    } else if (this.data.huidigePlaats == "voor kluis") {
      return `${this.data.huidigePlaats}`
    } else {
      return `bureau > ${this.data.huidigePlaats}`
    }
  }

  toonRugzak() {
    var uitvoer = "Rugzak: ";
    this.data.rugzak.forEach(t => {
      uitvoer += t + ", ";
    })
    uitvoer += `${this.data.bedragInRugzak} euro`;

    this.maakRegel("MACHINE", uitvoer);
  }

  toonInformatie(input: string) {
    this.level2(input);
  }

  help() {
    this.maakRegel("MACHINE", "HELP \n - in je rugzak kijken: typ 'rugzak' \n - informatie krijgen over huidige plaats: typ 'informatie' \n - terug: typ 'terug'");
  }

  level2(input: string) {
    if (this.data.terugVanLaptop) {
      this.data.terugVanLaptop = false;
      this.data.huidigePlaats = "tafel";
      this.tafel("terug van laptop");
    } else if (this.data.huidigePlaats == "bureau") {
      this.bureau(input);
    } else if (this.data.huidigePlaats == "keuken") {
      this.keuken(input);
    } else if (this.data.huidigePlaats == "gang") {
      this.gang(input);
    } else if (this.data.huidigePlaats == "kast") {
      this.kast(input);
    } else if (this.data.huidigePlaats == "plant") {
      this.plant(input);
    } else if (this.data.huidigePlaats == "tafel") {
      this.tafel(input);
    } else if (this.data.huidigePlaats == "lockers") {
      this.lockers(input);
    } else if (this.data.huidigePlaats == "voor kluis") {
      this.kluis(input);
    }else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  bureau(input: string) {
    if (input == "ga naar keuken" || input == "ga naar een keuken" || input == "ga naar de keuken") {
      this.keuken(input);
    } else if (input == "ga naar gang" || input == "ga naar een gang" || input == "ga naar de gang") {
      this.gang(input);
    } else if (input == "ga naar kast" || input == "ga naar een kast" || input == "ga naar de kast") {
      this.kast(input);
    } else if (input == "ga naar plant" || input == "ga naar een plant" || input == "ga naar de plant") {
      this.plant(input);
    } else if (input == "ga naar tafel" || input == "ga naar een tafel" || input == "ga naar de tafel") {
      this.tafel(input);
    } else if (input == "ga naar lockers" || input == "ga naar de lockers") {
      this.lockers(input);
    } else if (input == "terug") {
      this.bureau("ga binnen");
      this.maakRegel("MACHINE", "Op dit moment kan je niet terug!");
    } else if (input == "ga binnen" || input == "informatie") {
      this.data.huidigePlaats = "bureau"
      this.maakRegel("MACHINE", "Je staat nu in het bureau op de eerste verdieping van de bank. Je ziet: \n\
      - een KEUKEN \n\
      - een GANG\n\
      - een KAST \n\
      - een PLANT \n\
      - een TAFEL \n\
      - LOCKERS \n\
    typ \"ga naar ...\" om je te verplaatsen\n");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  keuken(input: string) {
    if (input == "ga naar keuken" || input == "ga naar een keuken" || input == "ga naar de keuken" || input == "informatie") {
      this.data.huidigePlaats = "keuken";
      this.maakRegel("", this.keukenArt, "art")
      if (this.data.vuurAan) {
        this.maakRegel("MACHINE", `Aha, je komt in de kraaknette, moderne IKEA keuken.\n\
      COMMANDO'S:\n\
      - kook water\n\
      - doe vuur uit\n\
      - neem water van kraan\n\
      - leeg thermoskan\n\
      - terug`);
      } else {
        this.maakRegel("MACHINE", `Aha, je komt in de kraaknette, moderne IKEA keuken.\n\
      COMMANDO'S:\n\
      - kook water\n\
      - steek vuur aan\n\
      - neem water van kraan\n\
      - leeg thermoskan\n\
      - terug`);
      }
    } else if (input == "kook water") {
      if (this.data.rugzak.includes("Thermoskan met koud water")) {
        this.maakRegel("MACHINE", `Je vulde jouw thermoskan met koud water. Zorg ervoor dat het koud water eerst uit de thermos is!`);
      } else if (this.data.rugzak.includes("Thermoskan met heet water")) {
        this.maakRegel("MACHINE", `Je vulde jouw thermos al met heet water!`);
      } else if (this.data.vuurAan) {
        this.data.rugzak[this.data.rugzak.indexOf("Thermoskan")] = "Thermoskan met heet water";
        this.maakRegel("MACHINE", `Je vulde jouw thermoskan met heet water en stak hem terug in je rugzak!`);
      } else {
        this.maakRegel("MACHINE", `Je kan het water niet koken als het gasvuur niet aan staat. Steek eerst het vuur aan!`);
      }
    } else if (input == "neem water van kraan") {
      if (this.data.rugzak.includes("Thermoskan met heet water")) {
        this.maakRegel("MACHINE", `Je vulde jouw thermoskan met heet water. Zorg ervoor dat het koud water eerst uit de thermos is!`);
      } else if (this.data.rugzak.includes("Thermoskan met koud water")) {
        this.maakRegel("MACHINE", `Je vulde jouw thermos al met koud water!`);
      } else {
        this.data.rugzak[this.data.rugzak.indexOf("Thermoskan")] = "Thermoskan met koud water";
        this.maakRegel("MACHINE", `Je vulde jouw thermoskan met koud water en stak hem terug in je rugzak!`);
      }

    } else if (input == "leeg thermoskan") {
      if (this.data.rugzak.includes("Thermoskan met koud water")) {
        this.data.rugzak[this.data.rugzak.indexOf("Thermoskan met koud water")] = "Thermoskan";
      } else {
        this.data.rugzak[this.data.rugzak.indexOf("Thermoskan met heet water")] = "Thermoskan";
      }
      this.maakRegel("MACHINE", `Jouw thermoskan is leeg en zit in je rugzak.`);
    }
    else if (input == "steek vuur aan") {
      this.data.vuurAan = true;
      this.maakRegel("MACHINE", `Je stak het kookvuur aan met de aansteker uit jouw rugzak.`);
    } else if (input == "doe vuur uit") {
      this.data.vuurAan = false;
      this.maakRegel("MACHINE", `Je deed het kookvuur uit.`);
    }

    else if (input == "terug") {
      this.data.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  gang(input: string) {
    if (input == "ga naar gang" || input == "ga naar een gang" || input == "ga naar de gang" || input == "informatie") {
      this.data.huidigePlaats = "gang";
      if (!this.data.beveilingUitgeschakeld) {
        this.maakRegel("MACHINE", "Op het einde van de gang zie je een kluis maar de gang hang vol camera's en infraroodsensoren. Hier geraak je niet zomaar voorbij!");
      } else {
        this.maakRegel("MACHINE", "COMMANDO'S:\n\
        - ga naar kluis \n\
        - terug");
      }
    } else if (input == "ga naar kluis" && this.data.beveilingUitgeschakeld) {
      this.data.huidigePlaats = "voor kluis";
      this.kluis("ga naar kluis")
    } else if (input == "terug") {
      this.data.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  kast(input: string) {
    if (input == "ga naar kast" || input == "ga naar een kast" || input == "ga naar de kast" || input == "informatie") {
      this.maakRegel("", this.kastArt, "art");
      this.data.huidigePlaats = "kast";
      if (this.data.kastOpen) {
        if (this.data.rugzak.includes("schaar")) {
          this.maakRegel("MACHINE", `In de kast hangt een kalender en ligt een schaar. \n\
        COMMANDO'S:\n\
        - bekijk kalender\n
        - terug`);
        } else {
          this.maakRegel("MACHINE", `In de kast hangt een kalender en ligt een schaar. \n\
        COMMANDO'S:\n\
        - bekijk kalender\n\
        - neem schaar\n\
        - terug`);
        }
      } else if (this.data.rugzak.includes("sleutel")) {
        this.maakRegel("MACHINE", `Je staat voor een supercoole, old-fashioned ebbenhouten kast die momenteel op slot zit. Je zal hem eerst moeten openen.\n\
        COMMANDO'S:\n\
        - open kast met sleutel\n\
        - terug`);
      } else {
        this.maakRegel("MACHINE", `Je staat voor een supercoole, old-fashioned ebbenhouten kast die momenteel op slot zit. Je zal hem eerst moeten openen`);
      }
    } else if (this.data.kastOpen && input == "neem schaar" && !this.data.rugzak.includes("schaar")) {
      this.data.rugzak.push("schaar");
      this.maakRegel("MACHINE", `De schaar zit in je rugzak!`);
    } else if (this.data.kastOpen && input == "bekijk kalender") {
      this.maakRegel("", this.kalender, "art");
    } else if (input == "open kast met sleutel") {
      if (this.data.rugzak.includes("sleutel")) {
        this.data.kastOpen = true;
        this.data.rugzak.splice(this.data.rugzak.indexOf("sleutel"), 1);
        this.maakRegel("MACHINE", `Je opende de ebbenhouten kast! Typ 'informatie' om te zien wat er in zit.\n`);
      } else {
        this.kast("error");
      }
    } else if (input == "terug") {
      this.data.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  plant(input: string) {
    if (input == "ga naar plant" || input == "ga naar een plant" || input == "ga naar de plant" || input == "informatie") {
      this.data.huidigePlaats = "plant";
      this.maakRegel("", this.plantArt, "art");
      if (this.data.plantMetWater && this.data.sleutelGenomen) {
        this.maakRegel("MACHINE", `Je gaf de plant water, en vond een sleutel!!`);
      } else if (this.data.plantMetWater) {
        this.maakRegel("MACHINE", `Je gaf de plant water. Doordat de aarde een beetje zakt, zie je nu iets blinken..? Het lijkt op een sleutel... \n\
        COMMANDO'S:\n\
        - neem sleutel\n\
        - terug`);
      } else {
        this.maakRegel("MACHINE", `Deze mooie sierlijke varen lijkt veel dorst te hebben!\n\
        COMMANDO'S:\n\
        - geef water\n\
        - terug`);
      }
    } else if (input == "geef water") {
      if (this.data.rugzak.includes("Thermoskan met koud water") && !this.data.plantMetWater) {
        this.data.rugzak[this.data.rugzak.indexOf("Thermoskan met koud water")] = "Thermoskan";
        this.data.plantMetWater = true;
        this.maakRegel("MACHINE", `Je gaf de plant water. Doordat de aarde een beetje zakt, zie je nu iets blinken..? Het lijkt op een sleutel... \n\
        COMMANDO'S:\n\
        - neem sleutel\n\
        - terug`);
      } else if (this.data.plantMetWater) {
        this.plant("error");
      } else {
        this.maakRegel("MACHINE", `Je hebt op dit moment geen koud water in je rugzak zitten!`);
      }
    } else if (input == "neem sleutel") {
      if (!this.data.sleutelGenomen && this.data.plantMetWater) {
        this.data.sleutelGenomen = true;
        this.maakRegel("", this.sleutel, "art");
        this.data.rugzak.push("sleutel");
        this.maakRegel("MACHINE", `Je vindt zomaar een sleutel in de bloempot van de plant! Woehoe!! De sleutel zit in je rugzak!`);
      } else { this.plant("error") }
    }
    else if (input == "terug") {
      this.data.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }

  }

  tafel(input: string) {
    if (input == "terug van laptop" && this.data.soniaIngelogd) {
      this.maakRegel("MACHINE", "Je kon het paswoord kraken! Doordat je toegang hebt tot de laptop kan je de camera's en infraroodsensoren in de gang uitschakelen!\n\
      COMMANDO'S:\n\
      - schakel beveiliging uit \n\
      - terug ");
    } else if (input == "ga naar tafel" || input == "ga naar een tafel" || input == "ga naar de tafel" || input == "informatie" || input == "terug van laptop") {
      this.data.huidigePlaats = "tafel";
      if (this.data.soniaIngelogd) {
        this.tafel("terug van laptop");
      } else if (this.data.laptopBeschikbaar) {
        this.maakRegel("MACHINE", `Op deze tafel ligt nu de laptop die je vond in één van de lockers!\n\
        COMMANDO'S:\n\
        - zet aan\n\
        - terug`);
      } else if (this.data.rugzak.includes("laptop")) {
        this.maakRegel("MACHINE", `Je vond een laptop in één van de lockers!\n\
        COMMANDO'S:\n\
        - leg laptop op tafel\n\
        - terug`);
      } else if (this.data.briefOpen) {
        this.maakRegel("", this.brief, "art");
        this.maakRegel("MACHINE", `Volgende TOP SECRET raadsels staan in de brief. Het zijn telkens 3-cijferige codes. Misschien komen hun oplossingen later nog van pas!`);
      }
      else {
        this.maakRegel("", this.bureauLamp, "art");
        this.maakRegel("MACHINE", `Op deze ebbenhouten designertafel staat er een lamp en ligt er een "TOP SECRET" brief.\n\
          COMMANDO'S: \n\
          - Open brief\n\
          - terug`);
      }
    } else if (input == "open brief") {
      if (this.data.rugzak.includes("Thermoskan met heet water")) {
        this.data.briefOpen = true;
        this.data.rugzak[this.data.rugzak.indexOf("Thermoskan met heet water")] = "Thermoskan";
        this.maakRegel("MACHINE", "Je opende de brief door de thermoskan onder de brief te houden en zo de plakrand los te krijgen! Het heet water verdampte uit je thermos. Type informatie om de inhoud van de brief te bekijken!")
      } else {
        this.maakRegel("MACHINE", `Deze brief is TOP SECRET! Je kan deze niet zomaar openen...De bankdirecteur zal zien dat jij de brief probeerde te openen. Probeer de brief te openen zonder sporen achter te laten!`);
      }
    } else if (input == "leg laptop op tafel" && this.data.rugzak.includes("laptop")) {
      this.data.rugzak.indexOf("laptop");
      this.data.rugzak.splice(this.data.rugzak.indexOf("laptop"), 1);
      this.data.laptopBeschikbaar = true;
      this.maakRegel("MACHINE", `Je legde de laptop op tafel.\n\
      COMMANDO'S: \n\
      - zet aan\n\
      - terug`);
    } else if (input == "zet aan" && this.data.laptopBeschikbaar) {
      this.router.navigate(['/laptop']);
    } else if (input == "schakel beveiliging uit" && this.data.soniaIngelogd) {
      this.data.beveilingUitgeschakeld = true;
      this.maakRegel("MACHINE", `De beveiling in de gang werd uitgeschakeld!\n`);
    }
    else if (input == "terug") {
      this.data.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  lockers(input: string) {
    if (input == "ga naar lockers" || input == "ga naar de lockers" || input == "informatie") {
      this.data.huidigePlaats = "lockers";
      this.maakRegel("", this.lockersArt(), "art");
      this.maakRegel("MACHINE", `Je staat aan de lockers. Elke locker heeft een codeslot. Kan jij ze open krijgen?\n\
          COMMANDO'S: \n\
          - Open locker x met code xxx\n\
          - terug`);
    }
    else if (["open", "locker", "met", "code"].every(i => input.split(" ").includes(i))) {
      var lockerNr = parseInt(input.split(" ")[2]);
      var code = input.split(" ")[5];
      if (isNaN(lockerNr) || lockerNr <= 0 || lockerNr > 3) {
        this.maakRegel("MACHINE", `Deze locker bestaat niet!`);
      } else if (code.length != 3) {
        this.maakRegel("MACHINE", `Deze code bestaat niet uit 3 cijfers!`);
      } else if ((lockerNr == 1 && code == "679") || (lockerNr == 2 && code == "223") || (lockerNr == 3 && code == "326")) {
        this.data.lockerCodes[lockerNr - 1] = code;
        if (!this.data.laptopOntvangen) {
          this.maakRegel("", this.lockersArt(), "art");
          this.maakRegel("MACHINE", `Je opende locker ${lockerNr} met de juiste code!`);
          if (!this.data.lockerCodes.includes("xxx")) {
            this.data.rugzak.push("laptop");
            this.data.laptopOntvangen = true;
            this.maakRegel("MACHINE", `Proficiat, je vond een laptop in locker ${lockerNr}.. Die zit op dit moment in je rugzak. Je kan deze op de tafel leggen en daar kijken wat je ermee kan doen!`)
          }
        } else {
          this.maakRegel("MACHINE", `Je opende alle lockers al!`)
        }
      } else {
        this.maakRegel("MACHINE", `De code ${code} voor ${lockerNr} is fout!`);
      }
    } else if (input == "terug") {
      this.data.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  kluis(input: string) {
    if (!this.isPlaying(this.audioZoeken) && this.data.radioAan) {
      this.audioZoeken.play();
    };
    if (input == "ga naar kluis" || input == "ga naar de kluis" || input == "informatie") {
      this.data.huidigePlaats = "voor kluis";
      this.maakRegel("", this.kluisArt, "art");
      this.maakRegel("MACHINE", `Je staat voor de kluis met het geld in. Rechts van de kluis staat een radio. Je sprak af met je kompanen dat ze de code van de kluis via een radiofrequentie zullen doorgeven,\
      maar je vergat de welke. Je onthield wel de tip: de frequentie is het kookpunt van H20 in Fahrenheit? ZET JE GELUID AAN!\n\
          COMMANDO'S: \n\
          - Stel radio in op frequentie xxx\n\
          - zet radio uit\n\
          - zet radio aan`);
    } else if (["stel", "radio", "in", "op"].every(i => input.split(" ").includes(i))) {
      var freq = input.split(" ")[5];
      if (freq == "212") {
        this.data.frequentieGeraden = true;
        this.maakRegel("MACHINE", "Hoera: je kon je de frequentie opnieuw herrinneren! Nu luister je naar de morsecode die jouw kompanen je doorzenden!\n\
        - open kluis met code xxxxxx\n\
        - zet radio uit\n\
        - zet radio aan");
        this.audioMorse.play();
        if (!this.isPlaying(this.audioZoeken)) {
          this.audioZoeken.play();
        };
      } else {
        this.maakRegel("MACHINE", "Helaas: op deze frequentie hoor je alleen geruis...");
      }
    } else if (input == "zet radio uit") {
      this.data.radioAan = false;
      this.audioMorse.pause();
      this.audioMorse.currentTime = 0
      this.audioZoeken.pause();
    } else if (["open", "kluis", "met", "code"].every(i => input.split(" ").includes(i)) && this.data.frequentieGeraden) {
      var freq = input.split(" ")[4];
      if (freq == "839205") {
        this.audioMorse.pause();
        this.audioZoeken.pause();
        this.data.eindKlok = moment();
        this.data.kluisOpen = true;
        this.router.navigate([`../certificaat`]);
      } else {
        this.maakRegel("MACHINE", "Helaas: De kluis gaat niet open met deze code...");
      }
    } else if (input == "zet radio aan") {
      this.data.radioAan = true;
      if (this.data.frequentieGeraden) {
        this.audioMorse.play();
      }
      this.audioZoeken.play();
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  spel(input: string) {
    if (this.data.voornaam == null) {
      this.data.voornaam = input;
    } else if (input == "rugzak") {
      this.toonRugzak();
    } else if (input == "restart") {
      this.data = new Data();
      this.updateData();
      this.router.navigate([`../level-1`]);
    } else if (input == "help") {
      this.help();
    } else if (input == "informatie") {
      this.toonInformatie(input);
    } else if (this.data.huidigLevel == 2) {
      this.level2(input);
    }
  }

  enter() {
    //haalt input uit het inputveld en zet het in de input VARiable
    var input = this.inputForm.value.input.toLowerCase().trim();
    this.maakRegel(this.data.voornaam, input);
    this.inputForm.get('input').setValue("");
    this.spel(input);
    this.updateData();
  }

  down() {
    if (this.data.downNummer > -1) {
      this.data.downNummer--;
    }
    if (this.data.gebruikersInvoer()[this.data.downNummer] != null) {
      this.inputForm.get('input').setValue(this.data.gebruikersInvoer()[this.data.downNummer].tekst);
    }
  }
  up() {
    if (this.data.downNummer < this.data.gebruikersInvoer().length) {
      this.data.downNummer++;
    }
    if (this.data.gebruikersInvoer()[this.data.downNummer] != null) {
      this.inputForm.get('input').setValue(this.data.gebruikersInvoer()[this.data.downNummer].tekst);
    } else {
      this.inputForm.get('input').setValue("");
    }
  }

  maakRegel(uitvoerder: string, text: string, type: string = "normaal") {
    var regel = new Regel;
    regel.uitvoerder = uitvoerder;
    regel.tekst = text;
    regel.type = type
    this.data.uitvoerData.push(regel);
    if (uitvoerder == this.data.voornaam) {
      this.data.downNummer = this.data.gebruikersInvoer().length;
    }
  }

  isPlaying(audio) {
    return audio
      && audio.currentTime > 0
      && !audio.paused
      && !audio.ended
      && audio.readyState > 2;
  }

  brief: string = String.raw`
  ._________________________________________________.
  |                                                 |
  |  1) We zoeken een code (xxx) die voldoet aan:   |
  |    - 147: één cijfer juist. Verkeerde plaats.   |
  |    - 189: één cijfers juist. Juiste plaats.    |
  |    - 964: twee cijfers juist. Verkeerde plaats. |
  |    - 523: alle cijfers zijn fout                |
  |    - 286: één cijfer juist. Verkeerde plaats    |
  |                                                 |
  |   2) In hoeveel landen is er scouting?          |
  |                                                 |
  |   3) 2${decodeURIComponent('%F0%9F%98%81')} + 7${decodeURIComponent('%F0%9F%9A%80')} + 4${decodeURIComponent('%F0%9F%8C%88')} = 44 ${'\t'}                    |
  |      3${decodeURIComponent('%F0%9F%98%81')} + 4${decodeURIComponent('%F0%9F%8C%88')} = 33  ${'\t'}                    |
  |      5${decodeURIComponent('%F0%9F%98%81')} = 15  ${'\t'}                            |
  |                                                 | 
  |      ${decodeURIComponent('%F0%9F%98%81')}${decodeURIComponent('%F0%9F%9A%80')}${decodeURIComponent('%F0%9F%8C%88')}  ${'\t'}                            |
  |_________________________________________________|
  `;

  plantArt: string = String.raw`
      *-*,
  ,*\/|'| \
  \'  | |'| *,
   \ '| | |/ )
    | |'| , /
    |'| |, /
  __|_|_|_|__
 [___________]
  |         |
  |         |
  |         |
  |_________|
  `;


  bureauLamp: string = String.raw`
                           .^.
                          |  :|'-._
                          |  :| '-._'-._
                         /  :: \    '-._'-._
                        /   ::  \       '-(_)
                       |_________|        / /
                           '-'           / /
                                        / /
                                       / /
                                      / /
            .________________________/ /____________________.
            |                                               |
            |            ._____________________.            |
            |            |\                   /|            |
            |            | \       TOP       / |            |
            |            |  \     SECRET    /  |            |
            |            |   \             /   |            |
            |            |    \___________/    |            |
            |            |                     |            |
            |            |_____________________|            |
            |                                               |
            |                                               |
            |_______________________________________________|
        `;
  kluisArt: string = String.raw`
       __________________
      /                  \
     /                    \
    /     o                \
   /    __|__               \
  |    /  |  \               | 
  | o-|-- * --|-o            |      .
  |    \__|__/               |      |
   \      |                 /       |
    \     o                /        ||______.
     \                    /         ||======|
      \__________________/          ||======|
  `;

  keukenArt: string = String.raw`
  _____________________________________________________
  ____________________________________________________\\
  |.-------.-------.|_.----._.----._|.-------.-------.\\\
  |]       |       [|       .       |]       |       [ \\\
  ||       |       ||     .':'.     ||       |       |  |\\
  ||       |       ||    .' : '.    ||       |       |  |\\\
  ||     (O|O)     ||   .'  :  '.   ||     (O|O)     |  | \\\
  ||       |       ||  .'===:==='.  ||       |       | O|  |\\
  ||       |       ||=='    :    '==||       |       |  |  |\\\
  |]       |       [|  )    :    (  |]       |       [  |O | \\\
  ||_______|_______||"" ____:_____""||_______|_______|  |  |  |\\
  '-----------------'_______________'----------------'  |  |  |\\\
  |.--------.  |    '---------------'  (o)______)(0)  \ |  |  | \\\
  ||        |::|_________________________________())___\|  | O|  \\\______
  ||        |::|-----______*!*______-------------))( .'.\  |  |   | _____ |
  ||________|::|  _ /       '       \  _        _   (__.'\ |  |O  ||     ||
  |____________| _  \_______________/     _           (_.'\|  |   ||  _  ||
   ___________________________________________      _  (___\  |   ||     ||
  ||.-----.|.------.|.-.-.--.--.-.-.||.-----.||\   _        \ |   ||     ||
  ||| === ||| ==== ||| | |  |  | | |||| === ||| \     _      \|   ||    _||
  ||'-----'|'------'|'-'-'--'--'-'-'||'-----'||. \          _ \   ||     ||
  ||.-----.|.------.|.------.------.||.-----.|| '|\       _    \  || _   ||
  ||| === |||      |||      |      |||| === |||\ | \  _         \ ||_____||
  ||'-----'|]      ||]      |      [||'-----'|| \|. \        _   \|_______|
  ||.-----.||    (O|||    (O|O)    |||.-----.||  | '|\                   ||
  ||| === |||      |||      |      |||| === |||  |\ | \__________________||
  |||     ||]      ||]      |      [|||     ||| O| \|. |  _____________  ||
  ||'-----'||______|||______|______|||'-----'||  |  | '| |             | ||
  ||LGB____|________|_______________||_______||  |O |\ | |   _         | ||
  ''-----------------------------------------' \ |  | \| |          _  | ||
     ____                 _______               \|  |  | |       _     | ||
             _________                  ______   \  |O | |             | ||
                                                  \ |  | |   _      _  | ||
                                  _________        \|  | |             | ||
        ___________        __                       \  | | _        _  | ||
      __                              _________      \ | |_____________| ||
                 ___________                          \|_________________||
        `;

  sleutel: string = String.raw`
   .--.
  /.-. '----------.
  \'-' .--"--""-"-'
   '--'
`;

  lockersArt(): string {
    return String.raw`
  ._____________________________________________________________________________.
  |                         |                         |                         |
  |        ._______.        |        ._______.        |        ._______.        |
  |        |   1   |        |        |   2   |        |        |   3   |        |
  |        '-------'        |        '-------'        |        '-------'        |
  |                         |                         |                         |
  |    .___.                |    .___.                |    .___.                |
  |    |___|                |    |___|                |    |___|                |
  |    |${this.data.lockerCodes[0]}|                |    |${this.data.lockerCodes[1]}|                |    |${this.data.lockerCodes[2]}|                |
  |    '---'                |    '---'                |    '---'                |
  |                         |                         |                         |
  |                         |                         |                         |
  |                         |                         |                         |
  '_________________________|_________________________|_________________________'
  `};

  kastArt: string = String.raw`
      __________________________ .
    .'                         .'|    
  .'                         .' .|       
.'________________________ .' .' |
|.-----------.|.----------.|.'   |
|]           ||           [|     |
||           ||            |     |
||           ||            |     |
||           ||            |     |
|]          o||o           |     |
||           ||            |     |
||           ||            |     |
||           ||            |     .
|]           ||           [|   .'(o)
||___________||____________| .'  
''-----------''-----------''
(o)                     (o)`;


  kalender: string = String.raw`
SEPTEMBER 2020
Ma          Di          Woe         Do          Vr          Za          Zo     
-------------------------------------------------------------------------------------
|           |1          |2          |3          |4          |5          |6          |
|           |           |           |           |           |19:00      |           |
|           |           |           |           |           |Sandbox    |           |
|           |           |           |           |           |test       |           |
|           |           |           |           |           |           |           |
-------------------------------------------------------------------------------------
|7          |8          |9          |10         |11         |12         |13         |
|           |           |9:00       |10:00      |           |           |           |
|           |           |Post       |Winst      |           |           |           |
|           |           |challenge  |           |           |           |           |
|           |           |to main    |SONIA: 52j |           |           |           |
-------------------------------------------------------------------------------------
|14         |15         |16         |17         |18         |19         |20         |
|           |           |           |           |           |           |           |
|           |           |           |           |           |           |           |
|           |           |           |           |           |           |           |
|           |           |           |           |           |           |           |
-------------------------------------------------------------------------------------
|21         |22         |23         |24         |25         |26         |27         |
|           |           |           |           |           |           |           |
|           |           |           |           |           |           |           |
|           |           |           |           |           |           |           |
|           |           |           |           |           |           |           |
-------------------------------------------------------------------------------------
|28         |29         |30         |31         |           |           |           |
|           |           |           |7:30       |           |           |           |
|           |           |           |Halloween  |           |           |           |
|           |           |           |party      |           |           |           |
|           |           |           |           |           |           |           |
-------------------------------------------------------------------------------------
`;


}
