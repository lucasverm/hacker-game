import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Regel } from '../regel';
import { DataService } from '../services/data.service';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';

@Component({
  selector: 'app-level2',
  templateUrl: './level2.component.html',
  styleUrls: ['./level2.component.scss']
})
export class Level2Component implements OnInit {
  public inputForm: FormGroup;
  constructor(public router: Router, private fb: FormBuilder, public dataService: DataService) { }

  ngOnInit() {
    this.inputForm = this.fb.group({
      input: [""]
    });
    this.dataService.huidigePlaats = "bureau";
    this.spel("ga binnen");
  }

  ngAfterViewInit() {
    document.getElementById("input").focus();
  }

  getLocatie() {
    if (this.dataService.huidigePlaats == "bureau") {
      return `${this.dataService.huidigePlaats}`
    } else if(this.dataService.huidigePlaats == "kluis"){
      return `bureau > gang > ${this.dataService.huidigePlaats}`
    } else {
      return `bureau > ${this.dataService.huidigePlaats}`
    }
  }

  toonRugzak() {
    var uitvoer = "Rugzak: ";
    this.dataService.rugzak.forEach(t => {
      uitvoer += t + ", ";
    })
    uitvoer += `${this.dataService.bedragInRugzak} euro`;

    this.maakRegel("MACHINE", uitvoer);
  }

  toonInformatie(input: string) {
    this.level2(input);
  }

  help() {
    this.maakRegel("MACHINE", "HELP \n - rugzak bekijken: typ rugzak \n - informatie krijgen over huidige plaats: typ informatie \n - terug: typ terug");
  }

  level2(input: string) {
    if (this.dataService.terugVanLaptop) {
      this.dataService.terugVanLaptop = false;
      this.dataService.huidigePlaats = "tafel";
      this.tafel("terug van laptop");
    } else if (this.dataService.huidigePlaats == "bureau") {
      this.bureau(input);
    } else if (this.dataService.huidigePlaats == "keuken") {
      this.keuken(input);
    } else if (this.dataService.huidigePlaats == "gang") {
      this.gang(input);
    } else if (this.dataService.huidigePlaats == "kast") {
      this.kast(input);
    } else if (this.dataService.huidigePlaats == "plant") {
      this.plant(input);
    } else if (this.dataService.huidigePlaats == "tafel") {
      this.tafel(input);
    } else if (this.dataService.huidigePlaats == "lockers") {
      this.lockers(input);
    }
  }

  bureau(input: string) {
    if (input == "ga naar keuken") {
      this.keuken(input);
    } else if (input == "ga naar gang") {
      this.gang(input);
    } else if (input == "ga naar kast") {
      this.kast(input);
    } else if (input == "ga naar plant") {
      this.plant(input);
    } else if (input == "ga naar tafel") {
      this.tafel(input);
    } else if (input == "ga naar lockers") {
      this.lockers(input);
    } else if (input == "terug") {
      this.bureau("ga binnen");
      this.maakRegel("MACHINE", "Op dit moment kan je niet terug!");
    } else if (input == "ga binnen" || input == "informatie") {
      this.dataService.huidigePlaats = "bureau"
      this.maakRegel("MACHINE", "Je staat nu in het bureau op het eerste verdiep van de bank. Je ziet: \n\
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
    if (input == "ga naar keuken" || input == "informatie") {
      this.dataService.huidigePlaats = "keuken";
      this.maakRegel("", this.keukenArt, "art")
      if (this.dataService.vuurAan) {
        this.maakRegel("MACHINE", `Aha, je komt in de kraak nette, zweeds IKEA keuken.\n\
      COMMANDO'S:\n\
      - kook water\n\
      - doe vuur uit\n\
      - neem water van kraan\n\
      - leeg themos`);
      } else {
        this.maakRegel("MACHINE", `Aha, je komt in de kraak nette, zweeds IKEA keuken.\n\
      COMMANDO'S:\n\
      - kook water\n\
      - steek vuur aan\n\
      - neem water van kraan\n\
      - leeg themos kan`);
      }
    } else if (input == "kook water") {
      if (this.dataService.rugzak.includes("Thermos kan met koud water")) {
        this.maakRegel("MACHINE", `Je vulde jouw thermos kan met koud water. Zorg ervoor dat het koud water eerst uit de thermos is!`);
      } else if (this.dataService.rugzak.includes("Thermos kan met heet water")) {
        this.maakRegel("MACHINE", `Je vulde jouw thermos al met heet water!`);
      } else if (this.dataService.vuurAan) {
        this.dataService.rugzak[this.dataService.rugzak.indexOf("Thermos kan")] = "Thermos kan met heet water";
        this.maakRegel("MACHINE", `Je vulde jouw thermos kan met heet water en stak hem terug in je rugzak!`);
      } else {
        this.maakRegel("MACHINE", `Je kan het water niet koken als het keukenvuur niet aan staat. Steek eerst het vuur aan!`);
      }
    } else if (input == "neem water van kraan") {
      if (this.dataService.rugzak.includes("Thermos kan met heet water")) {
        this.maakRegel("MACHINE", `Je vulde jouw thermos kan met heet water. Zorg ervoor dat het koud water eerst uit de thermos is!`);
      } else if (this.dataService.rugzak.includes("Thermos kan met koud water")) {
        this.maakRegel("MACHINE", `Je vulde jouw thermos al met koud water!`);
      } else {
        this.dataService.rugzak[this.dataService.rugzak.indexOf("Thermos kan")] = "Thermos kan met koud water";
        this.maakRegel("MACHINE", `Je vulde jouw thermos kan met koud water en stak hem terug in je rugzak!`);
      }

    } else if (input == "leeg thermos kan") {
      if (this.dataService.rugzak.includes("Thermos kan met koud water")) {
        this.dataService.rugzak[this.dataService.rugzak.indexOf("Thermos kan met koud water")] = "Thermos kan";
      } else {
        this.dataService.rugzak[this.dataService.rugzak.indexOf("Thermos kan met heet water")] = "Thermos kan";
      }
      this.maakRegel("MACHINE", `Jouw thermos kan is leeg en zit in je rugzak.`);
    }
    else if (input == "steek vuur aan") {
      this.dataService.vuurAan = true;
      this.maakRegel("MACHINE", `Je stak het keukenvuur aan met de aansteker uit jouw rugzak.`);
    } else if (input == "doe vuur uit") {
      this.dataService.vuurAan = false;
      this.maakRegel("MACHINE", `Je deed het keukenvuur uit.`);
    }

    else if (input == "terug") {
      this.dataService.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  gang(input: string) {
    if (input == "ga naar gang" || input == "informatie") {
      this.dataService.huidigePlaats = "gang";
      if (!this.dataService.beveilingUitgeschakeld) {
        this.maakRegel("MACHINE", "Op het einde van de gang zie je een kluis maar de gang hang vol camera's en infrarood sensoren. Hier graak je niet zomaar voorbij!");
      } else {
        this.maakRegel("MACHINE", "COMMANDO'S:\n\
        - ga naar kluis");
      }
    } else if (input == "ga naar kluis" && this.dataService.beveilingUitgeschakeld) {
      this.dataService.huidigePlaats = "kluis";
      this.maakRegel("MACHINE", "Proficiat! Je graakte voorbij level 2!");
    } else if (input == "terug") {
      this.dataService.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  kast(input: string) {
    if (input == "ga naar kast" || input == "informatie") {
      this.maakRegel("", this.kastArt, "art");
      this.dataService.huidigePlaats = "kast";
      if (this.dataService.kastOpen) {
        if (this.dataService.rugzak.includes("schaar")) {
          this.maakRegel("MACHINE", `In de kast hangt een kalender en ligt een schaar. \n\
        COMMANDO'S:\n\
        - bekijk kalender\n`);
        } else {
          this.maakRegel("MACHINE", `In de kast hangt een kalender en ligt een schaar. \n\
        COMMANDO'S:\n\
        - bekijk kalender\n\
        - neem schaar`);
        }
      } else if (this.dataService.rugzak.includes("sleutel")) {
        this.maakRegel("MACHINE", `Je staat voor een super coole, old-fashion ebben houten kast die momenteel op slot zit. Je zal hem eerst moeten openen\n\
        COMMANDO'S:\n\
        - open kast met sleutel`);
      } else {
        this.maakRegel("MACHINE", `Je staat voor een super coole, old-fashion ebbenhouten kast die momenteel op slot zit. Je zal hem eerst moeten openen`);
      }
    } else if (this.dataService.kastOpen && input == "neem schaar" && !this.dataService.rugzak.includes("schaar")) {
      this.dataService.rugzak.push("schaar");
      this.maakRegel("MACHINE", `De schaar zit in je rugzak!`);
    } else if (this.dataService.kastOpen && input == "bekijk kalender") {
      this.maakRegel("", this.kalender, "art");
    } else if (input == "open kast met sleutel") {
      if (this.dataService.rugzak.includes("sleutel")) {
        this.dataService.kastOpen = true;
        this.dataService.rugzak.splice(this.dataService.rugzak.indexOf("sleutel"), 1);
        this.maakRegel("MACHINE", `Je opende de ebbenhoute kast! Typ 'informatie' om te zien wat er in zit\n`);
      } else {
        this.kast("error");
      }
    } else if (input == "terug") {
      this.dataService.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  plant(input: string) {
    if (input == "ga naar plant" || input == "informatie") {
      this.dataService.huidigePlaats = "plant";
      if (this.dataService.plantMetWater && this.dataService.sleutelGenomen) {
        this.maakRegel("MACHINE", `Je gaf de plant water, en vond een sleutel!!`);
      } else if (this.dataService.plantMetWater) {
        this.maakRegel("MACHINE", `Je gaf de plant water. Doordat de aarde een beetje zakt zie je nu iets blinken..? Het lijkt op een sleutel... \n\
        COMMANDO'S:\n\
        - neem sleutel`);
      } else {
        this.maakRegel("MACHINE", `Deze mooie sierlijke varen lijkt veel dorst te hebben!\n\
        COMMANDO'S:\n\
        - geef water`);
      }
    } else if (input == "geef water") {
      if (this.dataService.rugzak.includes("Thermos kan met koud water") && !this.dataService.plantMetWater) {
        this.dataService.rugzak[this.dataService.rugzak.indexOf("Thermos kan met koud water")] = "Thermos kan";
        this.dataService.plantMetWater = true;
        this.maakRegel("MACHINE", `Je gaf de plant water. Doordat de aarde een beetje zakt zie je nu iets blinken..? Het lijkt op een sleutel... \n\
        COMMANDO'S:\n\
        - neem sleutel`);
      } else if (this.dataService.plantMetWater) {
        this.plant("error");
      } else {
        this.maakRegel("MACHINE", `Je hebt op dit moment geen koud water in je rugzak zitten!`);
      }
    } else if (input == "neem sleutel") {
      if (!this.dataService.sleutelGenomen && this.dataService.plantMetWater) {
        this.dataService.sleutelGenomen = true;
        this.maakRegel("", this.sleutel, "art");
        this.dataService.rugzak.push("sleutel");
        this.maakRegel("MACHINE", `Je vind zomaar een sleutel in de bloempot van de plant! Woehoe!! De sleutel zit in je rugzak!`);
      } else { this.plant("error") }
    }
    else if (input == "terug") {
      this.dataService.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }

  }

  tafel(input: string) {
    if (input == "terug van laptop" && this.dataService.soniaIngelogd) {
      this.maakRegel("MACHINE", "Je kon het passwoord kraken! Doordat je toegang hebt tot de laptop kan je de lichten en camera's in de gang uitschakelen!\n\
      COMMANDO'S:\n\
      - schakel beveiliging uit");
    } else if (input == "ga naar tafel" || input == "informatie" || input == "terug van laptop") {
      this.dataService.huidigePlaats = "tafel";
      if (this.dataService.laptopBeschikbaar) {
        this.maakRegel("MACHINE", `Op deze tafel licht de laptop die je vond in één van de lockers!\n\
        COMMANDO'S:\n\
        - zet aan`);
      } else if (this.dataService.rugzak.includes("laptop")) {
        this.maakRegel("MACHINE", `Je vond een laptop in één van de lockers!\n\
        COMMANDO'S:\n\
        - leg laptop op tafel`);
      } else if (this.dataService.briefOpen) {
        this.maakRegel("", this.brief, "art");
        this.maakRegel("MACHINE", `Volende TOP SECRET raadsels staan in de brief. Het zijn telkens 3-cijferige codes. misschien kunnen hun oplossingen later nuttig zijn!`);
      }
      else {
        this.maakRegel("", this.bureauLamp, "art");
        this.maakRegel("MACHINE", `Op deze ebbenhoute IKEA tafel staat er duidelijk een lamp en ligt er een "TOP SECRET" brief.\n\
          COMMANDO'S: \n\
          - Open brief`);
      }
    } else if (input == "open brief") {
      if (this.dataService.rugzak.includes("Thermos kan met heet water")) {
        this.dataService.briefOpen = true;
        this.dataService.rugzak[this.dataService.rugzak.indexOf("Thermos kan met heet water")] = "Thermos kan";
        this.maakRegel("MACHINE", "Je opende de brief door de thermoskan onder de brief te houden en zo de plakrand los te krijgen! Het heet water verdampte uit je thermos. Type informatie om de inhoud van de brief te bekijken!")
      } else {
        this.maakRegel("MACHINE", `Deze brief is TOP SECRET! Je kan deze niet zomaar openen...De bankdirecteur zal zien dat jij de brief probeerde te openen. Probeer de brief te openen zonder sporen achter te laten!`);
      }
    } else if (input == "leg laptop op tafel" && this.dataService.rugzak.includes("laptop")) {
      this.dataService.rugzak.indexOf("laptop");
      this.dataService.rugzak.splice(this.dataService.rugzak.indexOf("laptop"), 1);
      this.dataService.laptopBeschikbaar = true;
      this.maakRegel("MACHINE", `Je legde de laptop op tafel.\n\
      COMMANDO'S: \n\
      - zet aan`);
    } else if (input == "zet aan" && this.dataService.laptopBeschikbaar) {
      this.router.navigate([`../laptop`]);
    } else if (input == "schakel beveiliging uit" && this.dataService.soniaIngelogd) {
      this.dataService.beveilingUitgeschakeld = true;
      this.maakRegel("MACHINE", `De beveiling in de gang werd uitgeschakeld!\n`);
    }
    else if (input == "terug") {
      this.dataService.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  lockers(input: string) {
    if (input == "ga naar lockers" || input == "informatie") {
      this.dataService.huidigePlaats = "lockers";
      this.maakRegel("", this.lockersArt(), "art");
      this.maakRegel("MACHINE", `Je staat aan de lockers. Elke locker heeft een code. Kan jij ze open krijgen?\n\
          COMMANDO'S: \n\
          - Open locker x met code xxx`);
    }
    else if (["open", "locker", "met", "code"].every(i => input.split(" ").includes(i))) {
      var lockerNr = parseInt(input.split(" ")[2]);
      console.log(lockerNr);
      var code = input.split(" ")[5];
      if (isNaN(lockerNr) || lockerNr <= 0 || lockerNr > 3) {
        this.maakRegel("MACHINE", `Deze locker bestaat niet!`);
      } else if (code.length != 3) {
        this.maakRegel("MACHINE", `Deze code bestaat niet uit 3 cijfers!`);
      } else if ((lockerNr == 1 && code == "679") || (lockerNr == 2 && code == "223") || (lockerNr == 3 && code == "326")) {
        this.dataService.lockerCodes[lockerNr - 1] = code;
        console.log(this.dataService.lockerCodes);
        this.maakRegel("", this.lockersArt(), "art");
        this.maakRegel("MACHINE", `Je opende locker ${lockerNr} met de juiste code!`);
        if (!this.dataService.lockerCodes.includes("xxx")) {
          this.dataService.rugzak.push("laptop");
          this.maakRegel("MACHINE", `Proficiat, je vond een laptop in locker ${lockerNr}.. Die zit op dit moment in je rugzak. Je kan deze op de tafel leggen en daar kijken wat je ermee kan doen!`)
        }
      } else {
        this.maakRegel("MACHINE", `De code ${code} voor ${lockerNr} is fout!`);
      }
    } else if (input == "terug") {
      this.dataService.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  spel(input: string) {
    if (this.dataService.voornaam == null) {
      this.dataService.voornaam = input;
    } else if (input == "rugzak") {
      this.toonRugzak();
    } else if (input == "help") {
      this.help();
    } else if (input == "informatie") {
      this.toonInformatie(input);
    } else if (this.dataService.huidigLevel == 2) {
      this.level2(input);
    }
  }

  enter() {
    //haalt input uit het inputveld en zet het in de input VARiable
    var input = this.inputForm.value.input.toLowerCase().trim();
    this.maakRegel(this.dataService.voornaam, input);
    this.inputForm.get('input').setValue("");
    this.spel(input);
  }

  down() {
    if (this.dataService.downNummer >= 0) {
      this.dataService.downNummer--;
    }
    if (this.dataService.gebruikersInvoer()[this.dataService.downNummer] != null) {
      this.inputForm.get('input').setValue(this.dataService.gebruikersInvoer()[this.dataService.downNummer].tekst);
    }
  }
  up() {
    if (this.dataService.downNummer < this.dataService.gebruikersInvoer().length - 1) {
      this.dataService.downNummer++;
    }
    if (this.dataService.gebruikersInvoer()[this.dataService.downNummer + 1] != null) {
      this.inputForm.get('input').setValue(this.dataService.gebruikersInvoer()[this.dataService.downNummer + 1].tekst);
    } else {
      this.inputForm.get('input').setValue("");
    }
  }
  maakRegel(uitvoerder: string, text: string, type: string = "normaal") {
    var regel = new Regel;
    regel.uitvoerder = uitvoerder;
    regel.tekst = text;
    regel.type = type
    this.dataService.downNummer = this.dataService.gebruikersInvoer().length;
    this.dataService.uitvoerData.push(regel);
  }

  brief: string = String.raw`
  ._________________________________________________.
  |                                                 |
  |  1) We zoeken een code (xxx) die voldoet aan:   |
  |    - 147: één cijfer juist. Verkeerde plaats.   |
  |    - 189: twee cijfers juist. Juiste plaats.    |
  |    - 964: twij cijfers juist. Verkeerde plaats. |
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
  |          SONIA          |          TANIA          |          NANCY          |
  |    .___.                |    .___.                |    .___.                |
  |    |___|                |    |___|                |    |___|                |
  |    |${this.dataService.lockerCodes[0]}|                |    |${this.dataService.lockerCodes[1]}|                |    |${this.dataService.lockerCodes[2]}|                |
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
