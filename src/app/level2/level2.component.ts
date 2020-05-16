import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Regel } from '../regel';
import { DataService } from '../services/data.service';

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

  toonRugzak() {
    var uitvoer = "Rugzak: ";
    this.dataService.rugzak.forEach(t => {
      uitvoer += t + ", ";
    })
    uitvoer += `${this.dataService.bedragInRugzak} euro`;

    this.maakRegel("MACHINE", uitvoer);
  }

  toonLocatie(input: string) {
    if (this.dataService.huidigLevel == 2) {
      this.level2(input);
    }
    this.maakRegel("MACHINE", this.dataService.huidigePlaats);
  }

  help() {
    this.maakRegel("MACHINE", "HELP \n - rugzak bekijken: typ rugzak \n - locatie bekijken: typ locatie \n - terug: typ terug");
  }

  level2(input: string) {
    if (this.dataService.huidigePlaats == "bureau") {
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
    }

  }

  bureau(input: string) {
    console.log(input);
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
    } else if (input == "terug") {
      this.bureau("ga binnen");
      this.maakRegel("MACHINE", "Op dit moment kan je niet terug!");
    } else if (input == "ga binnen" || input == "locatie") {
      this.dataService.huidigePlaats = "bureau"
      this.maakRegel("MACHINE", "Je staat nu in het bureau op het eerste verdiep van de bank. Je ziet: \n\
      - een KEUKEN \n\
      - een GANG\n\
      - een KAST \n\
      - een PLANT \n\
      - een TAFEL \n\
    typ \"ga naar ...\" om je te verplaatsen\n");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  keuken(input: string) {
    if (input == "ga naar keuken" || input == "locatie") {
      this.dataService.huidigePlaats = "keuken";
      this.maakRegel("", this.keukenArt, "art")
      if (this.dataService.vuurAan) {
        this.maakRegel("MACHINE", `Aha, je komt in de kraak nette, zweeds IKEA keuken.\n\
      COMMANDOS:\n\
      - kook water\n\
      - doe vuur uit\n\
      - neem water van kraan\n\
      - leeg themos`);
      } else {
        this.maakRegel("MACHINE", `Aha, je komt in de kraak nette, zweeds IKEA keuken.\n\
      COMMANDOS:\n\
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
    if (input == "ga naar gang" || input == "locatie") {
      this.dataService.huidigePlaats = "gang";
      this.maakRegel("MACHINE", `Welkom in de gang\n`);
    } else if (input == "terug") {
      this.dataService.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  kast(input: string) {
    if (input == "ga naar kast" || input == "locatie") {
      this.dataService.huidigePlaats = "gang";
      this.maakRegel("MACHINE", `Welkom in bij de kast\n`);
    } else if (input == "terug") {
      this.dataService.huidigePlaats = "bureau";
      this.bureau("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  plant(input: string) {
    if (input == "ga naar plant" || input == "locatie") {
      this.dataService.huidigePlaats = "plant";
      this.maakRegel("MACHINE", `Deze mooie sierlijke varen lijkt veel dorst te hebben!\n\
        COMMANDOS:\n\
        - geef water`);
    } else if (input == "geef water") {
      if (this.dataService.rugzak.includes("Thermos kan met koud water")) {
        this.dataService.plantMetWater = true;
        this.maakRegel("MACHINE", `Je gaf de plant water. Doordat de aarde een beetje zakt zie je nu iets blinken..? Het lijkt op een sleutel... \n\
        COMMANDOS:\n\
        - neem sleutel`);
      } else {
        this.maakRegel("MACHINE", `Je hebt op dit moment geen koud water in je rugzak zitten!`);
      }
    } else if (input == "neem sleutel") {
      if (this.dataService.plantMetWater) {
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
    if (input == "ga naar tafel" || input == "locatie") {
      this.dataService.huidigePlaats = "tafel";
      this.maakRegel("", this.bureauLamp, "art");
      this.maakRegel("MACHINE", `Op deze ebbenhoute IKEA tafel staat er duidelijk een lamp en ligt er een "TOP SECRET" brief.\n\
          COMMANDOS: \n\
          - Open brief`);
    } else if (input == "open brief") {
      if (this.dataService.rugzak.includes("Thermos kan met heet water")) {
        this.maakRegel("MACHINE", "brief open!! Heet water uit Thermos")
      } else {
        this.maakRegel("MACHINE", `Deze brief is TOP SECRET! Je kan deze niet zomaar openen...De bankdirecteur zal zien dat jij de brief probeerde te openen.Probeer de brief te openen zonder sporen achter te laten!`);
      }
    }
    else if (input == "terug") {
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
    } else if (input == "locatie") {
      this.toonLocatie(input);
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

  bureauLamp: string = String.raw`
                           ^
                          ' '
                         |  :| '-._
                         |  :|  '-._' -._
                        /   :: \    '-._' -._
                       /     :: \        '-(_)
                      | _________ |        / /
                           '-'            / /
                                         / /
                                        / /
                                       / /
            .________________________ / /____________________.
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

}
