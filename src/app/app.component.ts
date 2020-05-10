import { Component, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Regel } from './regel';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hacker-game';
  public inputForm: FormGroup;
  uitvoerData: Regel[] = [];
  voornaam: string = null;
  huidigLevel = 0;
  rugzak = ["Beker", "USB-stick", "aansteker"];
  huidigePlaats = "voor de deur";

  constructor(public router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.inputForm = this.fb.group({
      input: [""]
    })
    this.welkomstBericht();
  }

  toonRugzak() {
    var uitvoer = "Rugzak: ";
    this.rugzak.forEach(t => {
      uitvoer += t + ", ";
    })
    this.maakRegel("MACHINE", uitvoer);
  }

  help() {
    this.maakRegel("MACHINE", "HELP \n - rugzak bekijken: typ rugzak \n - locatie bekijken: typ locatie \n - terug: typ terug");
  }

  spel(input: string) {
    if (this.voornaam == null) {
      this.voornaam = input;
      this.geefInstructies();
    } else if (input == "rugzak") {
      this.toonRugzak();
    } else if (input == "help") {
      this.help();
    } else if (input == "locatie") {
      this.maakRegel("MACHINE", this.huidigePlaats);
    } else if (this.huidigLevel == 0) {
      this.level0(input);
    } else if (this.huidigLevel == 1) {
      this.level1(input);
      return;
    }
  }

  level0(input: string) {
    if (input == "ga binnen") {
      this.huidigLevel = 1;
      this.huidigePlaats = "inkom";
      this.spel(input);
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!");
    }
  }

  level1(input: string) {
    if (this.huidigePlaats == "inkom") {
      this.level1Inkom(input);
    } else if (this.huidigePlaats == "zetel") {
      this.level1Zetel(input);
    }
  }

  level1Inkom(input: string) {
    if (input == "ga naar zetel") {
      this.level1Zetel(input);
    } else if (input == " ga naar automaat") {
      this.huidigePlaats = "automaat";
      this.maakRegel("MACHINE", "Naar automaat");
    } else if (input == " ga naar lift") {
      this.huidigePlaats = "lift";
      this.maakRegel("MACHINE", "Naar lift");
    } else if (input == " ga naar bodygoard") {
      this.huidigePlaats = "bodygoard";
      this.maakRegel("MACHINE", "Naar bodygoard");
    } else if (input == "terug") {
      this.maakRegel("MACHINE", "Op dit moment kan je niet terug!");
    } else if (input == "ga binnen") {
      this.huidigePlaats = "inkom";
      this.maakRegel("MACHINE", "Je staat nu in de inkom van de bank. Je ziet: \n\
    - een ZETEL\n\
    - een AUTOMAAT\n\
    - een lift \n\
    - een BODYGOARD\n\
    typ \"ga naar ...\" om je te verplaatsen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!");
    }
  }

  level1Zetel(input: string) {
    if (input == "ga naar zetel") {
      this.huidigePlaats = "zetel";
      if (!this.rugzak.includes("mundstuk 2 euro")) {
        this.maakRegel("MACHINE", `Je zit op een rode zetel, gemaakt door de beroemde kunstenaar Charles Rennie Mackintosh. De zetel werd ontworpen in 1983. Boven jou hangt een kunstwerk van Panamarenko. Op het kaartje dat erbij hangt staat er dat het om de aeromodeller blijkt te gaan, een reusachtige heteluchballon gemaakt rond 1970. Wat een gigantisch kunstwerk! Je ziet een centje blinken dat tussen de zetel zit!\n\
       - centje oprapen\n\
       - terug`);
      } else {
        this.maakRegel("MACHINE", `Je zit op een rode zetel, gemaakt door de beroemde kunstenaar Charles Rennie Mackintosh. De zetel werd ontworpen in 1983. Boven jou hangt een kunstwerk van Panamarenko. Op het kaartje dat erbij hangt staat er dat het om de aeromodeller blijkt te gaan, een reusachtige heteluchballon gemaakt rond 1970. Wat een gigantisch kunstwerk!\n\
       - terug`);
      }
    } else if (input == "centje oprapen") {
      var euro = String.raw`
             _.oood"""""""booo._
         _.o""      _____    * ""o._
       oP"  _.ooo""""   """"o|o*_* "Yo
     o8   oP                 | |"._* '8o
    d'  o8'_.--._            | |/  ,\* 'b
   d'  d'.' __   ".          | |: (( '\
  8'  d'/,-"  '.   :         | |  ||\_/* '8
 8   8'|/      :   :    |)   _ |  || |'|   8
,8  8          :  :   /)| \ || |\_|| | |8  8.
8' ,8         /  :    " /_) |':' | | | |8. '8
8  8'        /  /       _ _='  \ ' __   __  8
8  8        /  /        \|__ |  | |  | | 8| 8
8  8.      /  /         ||   |  | |-:' | 8| 8
8. '8    ,' ,'       __/ |__ |__| |  \ |__|,8
'8  8  ,' ,'      _ /     __ . . . . . .8LL8'
 8   8"   '------'/(    ,'  '.'. | | ,-|8  8
  8.(_________dd_/  \__/ '  0|'.': |: (8 ,8
   Y.  Y.                    | :/| |,\|* .P
    Y.  "8.          .,o     | | |,|"*  ,P
     "8.  "Yo_               | |p|"* ,8"
       "Y_   '"ooo.__   __.oo|"* * _P"
         ''"oo_     """""    * _oo""'
              '"""boooooood"""'
      `;
      if (!this.rugzak.includes("mundstuk 2 euro")) {
        this.maakRegel("", euro, true)
        this.rugzak.push("mundstuk 2 euro");
        this.maakRegel("MACHINE", "amai! Je vind zomaar een muntstuk van 2 euro tussen de zetel! It's your lucky day! Je steekt het muntstuk in je rugzak. \n\
      - rugzak\n\
      - terug");
      } else {
        this.maakRegel("MACHINE", "Dit commando is ongeldig!");
      }
    } else if (input == "terug") {
      this.huidigePlaats = "inkom";
      this.level1Inkom("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!");
    }
  }

  enter() {
    var input = this.inputForm.value.input;
    this.maakRegel(this.voornaam, input);
    this.inputForm.get('input').setValue("");
    this.spel(input);
  }

  geefInstructies() {
    const artStr = String.raw`
         _._._                       _._._
        _|   |_                     _|   |_
        | ... |_._._._._._._._._._._| ... |
        | ||| |  o NATIONAL BANK o  | ||| |
        | """ |  """    """    """  | """ |
   ())  |[-|-]| [-|-]  [-|-]  [-|-] |[-|-]|  ())
  (())) |     |---------------------|     | (()))
 (())())| """ |  """    """    """  | """ |(())())
 (()))()|[-|-]|  :::   .-"-.   :::  |[-|-]|(()))()
 ()))(()|     | |~|~|  |_|_|  |~|~| |     |()))(()
    ||  |_____|_|_|_|__|_|_|__|_|_|_|_____|  ||
 ~ ~^^ @@@@@@@@@@@@@@/=======\@@@@@@@@@@@@@@ ^^~ ~
      ^~^~                                ~^~^

    `;
    this.maakRegel("", artStr, true);
    this.maakRegel("MACHINE", `Dag ${this.voornaam}, Welkom in dit virtueel spel. Door de huidige covid-19 pandemie zijn bij veel verenigingen de centjes op. Daarom gaan we opzoek naar andere manieren om onze werkingen te kunnen blijven voortzetten. We hebben jou nodig om ons te helpen. \n\n\
    Op dit moment sta je voor een bank. Dit gebouw heeft verschillende verdiepingen. Jij staat nu buiten, voor het gebouw. Door dit systeem commando's te geven, kan je zelf beslissen naar waar je gaat en wat je doet. Ook heb je op dit moment een rugzak aan. Daarin zitten spullen die je hoogst waarschijnlijk kunnen helpen op je missie.\
    Om de rugzak te openen: typ \"rugzak\". Heb je meer info nodig: typ \"help\". Alles zal wel duidelijk worden. \n\n\
    Vanaf je het gebouw binnen stapt begint jouw klok te lopen! Succes! \n\n\
    Om het gebouw binnen te stappen: typ: \"ga binnen\".`);
  }

  welkomstBericht() {
    this.maakRegel("", "\n\n\
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n\
░███████╗░██████╗░██████╗░██╗░░░██╗████████╗███████╗░░░░░█████╗░██████╗░██████╗░██╗░░░██╗░\n\
░██╔════╝██╔════╝██╔═══██╗██║░░░██║╚══██╔══╝██╔════╝░░░░██╔══██╗██╔══██╗██╔══██╗██║░░░██║░\n\
░███████╗██║░░░░░██║░░░██║██║░░░██║░░░██║░░░███████╗░░░░███████║██████╔╝██║░░██║██║░░░██║░\n\
░╚════██║██║░░░░░██║░░░██║██║░░░██║░░░██║░░░╚════██║░░░░██╔══██║██╔══██╗██║░░██║██║░░░██║░\n\
░███████║╚██████╗╚██████╔╝╚██████╔╝░░░██║░░░███████║░░░░██║░░██║██║░░██║██████╔╝╚██████╔╝░\n\
░╚══════╝░╚═════╝░╚═════╝░░╚═════╝░░░░╚═╝░░░╚══════╝░░░░╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░░╚═════╝░░\n\
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n\
░██╗░░██╗░█████╗░░██████╗██╗░░██╗░░░░░███████╗██████╗ ███████╗██╗░░░░░░░░░░░░░░░░░░░░░░░░░\n\
░██║░░██║██╔══██╗██╔════╝██║░██╔╝░░░░░██╔════╝██╔══██╗██╔════╝██║░░░░░░░░░░░░░░░░░░░░░░░░░\n\
░███████║███████║██║░░░░░█████╔╝█████╗███████╗██████╔╝█████╗░░██║░░░░░░░░░░░░░░░░░░░░░░░░░\n\
░██╔══██║██╔══██║██║░░░░░██╔═██╗╚════╝╚════██║██╔═══╝ ██╔══╝░░██║░░░░░░░░░░░░░░░░░░░░░░░░░\n\
░██║░░██║██║░░██║╚██████╗██║░░██╗░░░░░███████║██║░░░░░███████╗███████╗░░░░░░░░░░░░░░░░░░░░\n\
░╚═╝░░╚═╝╚═╝░░╚═╝░╚═════╝╚═╝░░╚═╝░░░░░╚══════╝╚═╝░░░░░╚══════╝╚══════╝░░░░░░░░░░░░░░░░░░░░\n\
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n\
    ", true);

    this.maakRegel("MACHINE", "Welkom op het hackspel van Scouts ardu. De bedoeling is dat jij onze scouts hackt! Volg de vragen, en denk goed na! Zorg dat je de pagina NIET refreshed! Veel hackplezier!!");
    this.maakRegel("MACHINE", "Geef je voornaam in: ");
  }

  maakRegel(uitvoerder: string, text: string, art: boolean = false) {
    var regel = new Regel;
    regel.uitvoerder = uitvoerder;
    regel.tekst = text;
    regel.art = art;
    this.uitvoerData.push(regel);
  }
}


