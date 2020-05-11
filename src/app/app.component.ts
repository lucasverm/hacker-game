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
  startKlok = null;
  public inputForm: FormGroup;
  uitvoerData: Regel[] = [];
  voornaam: string = null;
  huidigLevel = 0;
  rugzak = ["Beker", "USB-stick", "aansteker"];
  huidigePlaats = "voor de deur";
  mundstukGevonden = false;
  private _bedragInRugzak = 0;
  get bedragInRugzak(): number {
    return this._bedragInRugzak;
  }
  set bedragInRugzak(bedrag: number) {
    console.log("setter");
    this._bedragInRugzak = Math.round(bedrag * 100) / 100;
  }
  private _bedragInAutomaat = 0;
  get bedragInAutomaat(): number {
    return this._bedragInAutomaat;
  }
  set bedragInAutomaat(bedrag: number) {
    console.log("setter");
    this._bedragInAutomaat = Math.round(bedrag * 100) / 100;
  }

  constructor(public router: Router, private fb: FormBuilder) { }

  //deze mothode wordt uigevoerd bij het openen van de pagina
  ngOnInit() {
    //onbelangrijk voor jou
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
    uitvoer += `${this.bedragInRugzak} euro`;

    this.maakRegel("MACHINE", uitvoer);
  }

  toonLocatie(input: string) {
    if (this.huidigLevel == 0) {
      this.level0(input);
    } else if (this.huidigLevel == 1) {
      this.level1(input);
    }
    this.maakRegel("MACHINE", this.huidigePlaats);
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
      this.toonLocatie(input);
    } else if (this.huidigLevel == 0) {
      this.level0(input);
    } else if (this.huidigLevel == 1) {
      this.level1(input);
    }
  }

  level0(input: string) {
    if (input == "ga binnen") {
      this.huidigLevel = 1;
      this.huidigePlaats = "inkom";
      this.spel(input);
    } else if (input == "locatie") {
      this.maakRegel("MACHINE", "Om het gebouw binnen te stappen: typ: \"ga binnen\".");
    }
    else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  level1(input: string) {
    if (this.huidigePlaats == "inkom") {
      this.level1Inkom(input);
    } else if (this.huidigePlaats == "zetel") {
      this.level1Zetel(input);
    } else if (this.huidigePlaats == "automaat") {
      this.level1Automaat(input);
    }
  }

  level1Inkom(input: string) {
    if (input == "ga naar zetel") {
      this.level1Zetel(input);
    } else if (input == "ga naar automaat") {
      this.level1Automaat(input);
    } else if (input == " ga naar lift") {
      this.huidigePlaats = "lift";
      this.maakRegel("MACHINE", "Naar lift");
    } else if (input == " ga naar bodygoard") {
      this.huidigePlaats = "bodygoard";
      this.maakRegel("MACHINE", "Naar bodygoard");
    } else if (input == "terug") {
      this.maakRegel("MACHINE", "Op dit moment kan je niet terug!");
    } else if (input == "ga binnen" || input == "locatie") {
      this.huidigePlaats = "inkom";
      if (this.startKlok == null) {
        this.startKlok = new Date();
      }
      this.maakRegel("MACHINE", "Je staat nu in de inkom van de bank. Je ziet: \n\
    - een ZETEL\n\
    - een AUTOMAAT\n\
    - een lift \n\
    - een SECURITYGUARD\n\
    typ \"ga naar ...\" om je te verplaatsen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  level1Zetel(input: string) {
    if (input == "ga naar zetel" || input == "locatie") {
      this.huidigePlaats = "zetel";
      if (!this.mundstukGevonden) {
        this.maakRegel("MACHINE", `Je zit op een rode zetel, gemaakt door de beroemde kunstenaar Charles Rennie Mackintosh. De zetel werd ontworpen in 1983. Boven jou hangt een kunstwerk van Panamarenko. Op het kaartje dat erbij hangt staat er dat het om de aeromodeller blijkt te gaan, een reusachtige heteluchballon gemaakt rond 1970. Wat een gigantisch kunstwerk! Je ziet een centje blinken dat tussen de zetel zit!\n\
       - centje oprapen\n\
       - terug`);
      } else {
        this.maakRegel("MACHINE", `Je zit op een rode zetel, gemaakt door de beroemde kunstenaar Charles Rennie Mackintosh. De zetel werd ontworpen in 1983. Boven jou hangt een kunstwerk van Panamarenko. Op het kaartje dat erbij hangt staat er dat het om de aeromodeller blijkt te gaan, een reusachtige heteluchballon gemaakt rond 1970. Wat een gigantisch kunstwerk!\n\
       - terug`);
      }
    } else if (input == "centje oprapen") {

      if (!this.mundstukGevonden) {
        this.maakRegel("", this.euro, "art")
        this.maakRegel("MACHINE", "amai! Je vind zomaar een muntstuk van 2 euro tussen de zetel! It's your lucky day! Je steekt het muntstuk in je rugzak. \n\
      - rugzak\n\
      - terug");
        this.mundstukGevonden = true;
        this.bedragInRugzak = 2;
      } else {
        this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
      }
    } else if (input == "terug") {
      this.huidigePlaats = "inkom";
      this.level1Inkom("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  level1Automaat(input: string) {
    console.log("in automaat");

    if (input == "ga naar automaat" || input == "locatie") {
      this.huidigePlaats = "automaat";
      this.maakRegel("", this.machine, "art");
      this.maakRegel("MACHINE", `Je staat voor een autmaat. Deze automaat is rood en wit en ziet er al wat versleten uit. Hij is bijna leeg. Inhoud: \n\
      - COLA: 1,20 euro\n\
      - WAFEL: 2,20 euro\n\
      - MENTOS: 0,70 euro\n\n\
      COMMANDOS: \n\
      - bonk op automaat\n\
      - steek x euro in automaat
      - bedrag in automaat
      - haal geld uit automaat
      - koop ...`);
    } else if (input == "bedrag in automaat") {
      this.maakRegel("MACHINE", `Er zit momenteel ${this.bedragInAutomaat} euro in de automaat.`);
    } else if (input == "haal geld uit automaat") {
      if (this.bedragInAutomaat == 0) {
        this.maakRegel("MACHINE", `Helaas, er zit geen geld in de automaat.`);
      } else {
        this.bedragInRugzak += this.bedragInAutomaat;
        this.maakRegel("MACHINE", `Je haalde ${this.bedragInAutomaat} euro uit de automaat.`);
        this.bedragInAutomaat = 0;
      }
    } else if (input == "koop mentos") {
      if (this.rugzak.includes("mentos")) {
        this.maakRegel("MACHINE", "De mentos is op!");
      } else if (this.bedragInAutomaat >= 0.7) {
        this.bedragInAutomaat -= 0.7;
        this.rugzak.push("mentos");
        this.maakRegel("MACHINE", "Je kocht mentos van uit de automaat. Die zit nu in je rugzak.");
      } else {
        this.maakRegel("MACHINE", "Er zit onvoldoende geld in de automaat.");
      }
    } else if (input == "koop cola") {
      if (this.bedragInAutomaat >= 1.2) {
        this.bedragInAutomaat -= 1.2;
        this.rugzak.push("cola");
        this.maakRegel("MACHINE", "Je kocht cola van uit de automaat. Die zit nu in je rugzak.");
      } else {
        this.maakRegel("MACHINE", "Er zit onvoldoende geld in de automaat.");
      }
    }
    else if (input == "koop wafel") {
      this.maakRegel("MACHINE", "Er zit onvoldoende geld in de automaat.");
    }
    else if (input == "bonk op automaat") {
      this.maakRegel("MACHINE", "Er viel niks uit de automaat.. De securityguard kijkt je boos aan! Opgelet!");
      //kijkt of de volgende woorden in de input staan
    } else if (["steek", "euro", "in", "automaat"].every(i => input.split(" ").includes(i))) {
      var bedrag = parseFloat(input.split(" ")[1].replace(',', '.'));
      console.log(bedrag);

      if (bedrag > this.bedragInRugzak) {
        this.maakRegel("MACHINE", "Je hebt onvoldoende geld op zak om in de automaat te steken.");
      } else {
        this.bedragInAutomaat += bedrag;
        this.bedragInRugzak -= bedrag;
        this.maakRegel("MACHINE", `Je stak ${bedrag} euro in de automaat.`);
      }
    } else if (input == "terug") {
      this.huidigePlaats = "inkom";
      this.level1Inkom("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  enter() {
    //haalt input uit het inputveld en zet het in de input VARiable
    var input = this.inputForm.value.input;

    this.maakRegel(this.voornaam, input);
    this.inputForm.get('input').setValue("");
    this.spel(input);
  }

  geefInstructies() {
    this.maakRegel("", this.bank, "art");
    this.maakRegel("MACHINE", `Dag ${this.voornaam}, Welkom in dit virtueel spel.Door de huidige covid - 19 pandemie zijn bij veel verenigingen de centjes op.Daarom gaan we op zoek naar andere manieren om onze werkingen te kunnen blijven voortzetten.We hebben jou nodig om ons te helpen.\n\n\
      Op dit moment sta je voor een bank.Dit gebouw heeft verschillende verdiepingen.Jij staat nu buiten, voor het gebouw.Door dit systeem commando's te geven, kan je zelf beslissen naar waar je gaat en wat je doet. Ook heb je op dit moment een rugzak aan. Daarin zitten spullen die je hoogstwaarschijnlijk kunnen helpen op je missie.\
    Om de rugzak te openen: typ \"rugzak\". Heb je meer info nodig: typ \"help\". Alles zal wel duidelijk worden. \n\n\
    Vanaf je het gebouw binnen stapt begint jouw klok te lopen! Succes! \n\n\
    Om het gebouw binnen te stappen: typ: \"ga binnen\".`);
  }

  welkomstBericht() {
    this.maakRegel("", this.scoutsArduHackSpel, "art");

    this.maakRegel("MACHINE", "Welkom op het hackspel van Scouts ardu. De bedoeling is dat jij onze scouts hackt! Volg de vragen, en denk goed na! Zorg dat je de pagina NIET refreshed! Veel hackplezier!!");
    this.maakRegel("MACHINE", "Geef je voornaam in: ");
  }

  //maakt een regel aan en schrijft die naar de uitvoer
  maakRegel(uitvoerder: string, text: string, type: string = "normaal") {
    var regel = new Regel;
    regel.uitvoerder = uitvoerder;
    regel.tekst = text;

    regel.type = type
    this.uitvoerData.push(regel);
  }

  scoutsArduHackSpel = String.raw`
███████╗ ██████╗ ██████╗ ██╗   ██╗████████╗███████╗     █████╗ ██████╗ ██████╗ ██╗   ██╗
██╔════╝██╔════╝██╔═══██╗██║   ██║╚══██╔══╝██╔════╝    ██╔══██╗██╔══██╗██╔══██╗██║   ██║
███████╗██║     ██║   ██║██║   ██║   ██║   ███████╗    ███████║██████╔╝██║  ██║██║   ██║
╚════██║██║     ██║   ██║██║   ██║   ██║   ╚════██║    ██╔══██║██╔══██╗██║  ██║██║   ██║
███████║╚██████╗╚██████╔╝╚██████╔╝   ██║   ███████║    ██║  ██║██║  ██║██████╔╝╚██████╔╝
╚══════╝ ╚═════╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝ 
                                                                                        
██╗  ██╗ █████╗  ██████╗██╗  ██╗███████╗██████╗ ███████╗██╗                             
██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗██╔════╝██║                             
███████║███████║██║     █████╔╝ ███████╗██████╔╝█████╗  ██║                             
██╔══██║██╔══██║██║     ██╔═██╗ ╚════██║██╔═══╝ ██╔══╝  ██║                             
██║  ██║██║  ██║╚██████╗██║  ██╗███████║██║     ███████╗███████╗                        
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝╚══════╝                                                                                                                
`;
  bank: string = String.raw`
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

  euro: string = String.raw`
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

  machine: string = String.raw`
  ____________________________________________
  |############################################|
  |########### --- AUTOMAAT --- ###############|
  |############################################|
  |#|                           |##############|
  |#|  ======                   |##|''''''''|##|
  |#|  |    |                   |##| Gepast |##|
  |#|  |COCA|   ___      __     |##|Betalen!|##|
  |#|  |COLA|  / __\    / __\   |##|        |##|
  |#|  |____|  \__//    \__//   |##|________|##|
  |#|===========================|##############|
  |#|'''''''''''''''''''''''''''|##############|
  |#| |-----|                   |##############|
  |#| |/_|_\|                   |#|'''''''''|##|
  |#| |\|_|/|   ___      __     |#| _______ |##|
  |#| |/_|_\|  / __\    / __\   |#| |1|2|3| |##|
  |#| |\|_|/|  \__//    \__//   |#| |4|5|6| |##|
  |#|===========================|#| |7|8|9| |##|
  |#|'''''''''''''''''''''''''''|#| ''''''' |##|
  |#|                           |#|[=======]|##|
  |#|              ==           |#|  _   _  |##|
  |#|   ___       ///    ___    |#| ||| ( ) |##|
  |#|  / __\     ///    / __\   |#| |||  '  |##|
  |#|  \__//    ///     \__//   |#|  ~      |##|
  |#|===========================|#|_________|##|
  |#|'''''''''''''''''''''''''''|##############|
  |############################################|
  |#|||||||||||||||||||||||||||||####'''''''###|
  |#||||||||||||DUW||||||||||||||####\|||||/###|
  |############################################|
  \\\\\\\\\\\\\\\\\\\\\\///////////////////////
   |__________________________________________|
  
         `;
}


