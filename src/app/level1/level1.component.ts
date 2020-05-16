import { Component, OnInit } from '@angular/core';
import { Regel } from '../regel';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-level1',
  templateUrl: './level1.component.html',
  styleUrls: ['./level1.component.scss']
})
export class Level1Component implements OnInit {

  title = 'hacker-game';
  startKlok = null;
  public inputForm: FormGroup;
  uitvoerData: Regel[] = [];
  voornaam: string = null;
  huidigLevel = 0;
  rugzak = ["Beker", "USB-stick", "aansteker"];
  huidigePlaats = "voor de deur";
  mundstukGevonden = false;
  securityGuardAfgeleid = false;
  inLift = false;
  downNummer: number = 0;

  private _bedragInRugzak = 0;
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

  constructor(public router: Router, private fb: FormBuilder) { }

  //deze mothode wordt uigevoerd bij het openen van de pagina
  ngOnInit() {
    //onbelangrijk voor jou
    this.inputForm = this.fb.group({
      input: [""]
    })
    this.welkomstBericht();
  }

  ngAfterViewInit() {
    document.getElementById("input").focus();
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
    } else if (this.huidigePlaats == "lift") {
      this.level1Lift(input);
    } else if (this.huidigePlaats == "securityguard") {
      this.level1SecurityGuard(input);
    } else if (this.huidigePlaats == "secretaresse") {
      this.level1Secretaresse(input);
    }
  }

  level1Inkom(input: string) {
    if (input == "ga naar zetel") {
      this.level1Zetel(input);
    } else if (input == "ga naar automaat") {
      this.level1Automaat(input);
    } else if (input == "ga naar lift") {
      this.huidigePlaats = "lift";
      this.level1Lift(input);
    } else if (input == "ga naar secretaresse") {
      this.huidigePlaats = "secretaresse";
      this.level1Secretaresse(input);
    } else if (input == "ga naar securityguard") {
      this.huidigePlaats = "securityguard";
      this.level1SecurityGuard(input);
    } else if (input == "terug") {
      this.level1Inkom("ga binnen");
      this.maakRegel("MACHINE", "Op dit moment kan je niet terug!");
    } else if (input == "ga binnen" || input == "locatie") {
      this.huidigePlaats = "inkom";
      if (this.startKlok == null) {
        this.startKlok = new Date();
      }
      this.maakRegel("MACHINE", "Je staat nu in de inkom van de bank. Je ziet: \n\
      - een lift \n\
      - een SECURITYGUARD\n\
      - een ZETEL\n\
      - een SECRETARESSE\n\
      - een AUTOMAAT\n\n\
    typ \"ga naar ...\" om je te verplaatsen\n");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  level1Lift(input: string) {
    if (input == "ga naar lift" || input == "locatie") {
      this.huidigePlaats = "lift";
      this.maakRegel("", this.lift, "art");
      if (!this.securityGuardAfgeleid) {
        this.maakRegel("MACHINE", "Security guard: \"Hela jongeman, deze toegang is niet voor onbevoegden!\"");
      } else {
        this.maakRegel("MACHINE", "COMMANDOS:\n - Open lift");
      }
    } else if (input == "open lift") {
      if (this.securityGuardAfgeleid) {
        this.inLift = true;
        this.maakRegel("", this.liftCode, "art");
        this.maakRegel("MACHINE", "Je staat nu in de lift en ziet dit:");
      } else {
        this.level1Lift("error");
      }
    }
    else if (input == "20") {
      if (this.inLift) {
        this.maakRegel("", this.firework, "art");
        this.maakRegel("MACHINE", "Proficiat! Je eindigde level 1! De lift gaat nu naar boven, en je komt seffens terecht in level 2. Succes!!");
      } else {
        this.level1Lift("error");
      }
    } else if (input == "terug") {
      this.huidigePlaats = "inkom";
      this.level1Inkom("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  level1SecurityGuard(input: string) {
    if (input == "ga naar securityguard" || input == "locatie") {
      this.huidigePlaats = "securityguard";
      this.maakRegel("", this.securityGuard, "art");
      if (this.rugzak.includes("mentos") && this.rugzak.includes("cola")) {
        this.maakRegel("MACHINE", "Amai, azo nen peet! Jawadde dadde! Hij houd iedereen goed in de gaten. Hij zorgt ervoor dat er geen geld wordt gestolen of er mensen de bank binnen dringen. Hier graak je niet zomaar voorbij hoor! \n\
      COMMANDOS: \n\
        - leid af met cola en mentos\n\
        - vraag waar toilet is\n\
        - verkoop aansteker");
      } else {
        this.maakRegel("MACHINE", "Amai, azo nen peet! Jawadde dadde! \n\
        COMMANDOS: \n\
          - vraag waar toilet is\n\
          - verkoop aansteker");
      }
    } else if (input == "leid af met cola en mentos") {
      this.securityGuardAfgeleid = true;
      this.maakRegel("", this.colaMentos, "art");
      this.maakRegel("MACHINE", "Je steekt het volledige pakje mentos in het cola flesje, en zet het net achter de securityguard. Psssssssst! Alles begint te spuiten, een ware fontijn!\
        De securityguard kijkt je aan, maar jij loop nonchalant verder. Niemand zag het je doen. Wat heb jij chance!! De securityguard is helemaal vuil en druipt af naar het tiolet om zijn kleren proper te maken.");
    } else if (input == "vraag waar toilet is") {
      this.maakRegel("MACHINE", "Securityguard: \"Het toilet is hier aan de lift naar rechts. Goed mikken hé, we zijn hier niet op scoutskamp!\"");
    }
    else if (input == "verkoop aansteker") {
      this.maakRegel("MACHINE", `Securityguard: "Ah toeme, Ik heb geen geld op zak!"`);

    } else if (input == "terug") {
      this.huidigePlaats = "inkom";
      this.level1Inkom("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  level1Secretaresse(input: string) {
    if (input == "ga naar secretaresse" || input == "locatie") {
      this.huidigePlaats = "secretaresse";
      this.maakRegel("", this.secretaresse, "art");
      this.maakRegel("MACHINE", "De secretaresse heeft mooie bruin-blonde krullen. Ze heeft een bloes en halsketting aan en kauwkomt er op los, een streling voor het oog! 1.5 meter afstand houden!\n\
      COMMANDOS: \n\
        - vraag waar toilet is\n\
        - verkoop aansteker");
    } else if (input == "vraag waar toilet is") {
      this.maakRegel("MACHINE", "Secretaresse: \"Het toilet is naast de lift naar rechts. Gelieve je handen goed te wassen in verband met de huidige corona maatregelen!\"");
    } else if (input == "verkoop aansteker") {
      this.maakRegel("MACHINE", `Secretaresse: "Sorry, ${this.voornaam}. Ik kan geen aansteker gebruiken. Ik kan je niet helpen."`);
    } else if (input == "terug") {
      this.huidigePlaats = "inkom";
      this.level1Inkom("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  level1Zetel(input: string) {
    if (input == "ga naar zetel" || input == "locatie") {
      this.huidigePlaats = "zetel";
      if (!this.mundstukGevonden) {
        this.maakRegel("MACHINE", `Je zit op een rode zetel, gemaakt door de beroemde kunstenaar Charles Rennie Mackintosh. De zetel werd ontworpen in 1983. Boven jou hangt een kunstwerk van Panamarenko. Op het kaartje dat erbij hangt staat er dat het om de aeromodeller blijkt te gaan, een reusachtige heteluchballon gemaakt rond 1970. Wat een gigantisch kunstwerk! Je ziet een centje blinken dat tussen de zetel zit!\n\
       - mundstuk oprapen\n\
       - terug`);
      } else {
        this.maakRegel("MACHINE", `Je zit op een rode zetel, gemaakt door de beroemde kunstenaar Charles Rennie Mackintosh. De zetel werd ontworpen in 1983. Boven jou hangt een kunstwerk van Panamarenko. Op het kaartje dat erbij hangt staat er dat het om de aeromodeller blijkt te gaan, een reusachtige heteluchballon gemaakt rond 1970. Wat een gigantisch kunstwerk!\n\
       - terug`);
      }
    } else if (input == "mundstuk oprapen") {

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
    var input = this.inputForm.value.input.toLowerCase().trim();
    this.maakRegel(this.voornaam, input);
    this.inputForm.get('input').setValue("");
    this.spel(input);
  }

  gebruikersInvoer() {
    return this.uitvoerData.filter(t => t.uitvoerder == this.voornaam || t.uitvoerder == null);
  }

  down() {
    if (this.downNummer >= 0) {
      this.downNummer--;
    }
    if (this.gebruikersInvoer()[this.downNummer] != null) {
      this.inputForm.get('input').setValue(this.gebruikersInvoer()[this.downNummer].tekst);
    }
  }
  up() {
    if (this.downNummer < this.gebruikersInvoer().length - 1) {
      this.downNummer++;
    }
    if (this.gebruikersInvoer()[this.downNummer + 1] != null) {
      this.inputForm.get('input').setValue(this.gebruikersInvoer()[this.downNummer + 1].tekst);
    } else {
      this.inputForm.get('input').setValue("");
    }
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
    this.downNummer = this.gebruikersInvoer().length;
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

  lift: string = String.raw`
          .-----.
        /_ INKOM _\
     .---------------.
     ||      |      ||
     ||      |      ||
     ||      |      ||
     ||      |      ||.-.
     ||      |      |||x|
     ||      |      |||x|
     ||      |      ||'-'
     ||      |      ||
     ||      |      ||
     ||      |      ||
     ||      |      ||
     ||      |      ||
     '---------------'
  `;

  securityGuard: string = String.raw`
        _.---._
     .-' ((O)) '-.
      \ _.\_/._ /
       /..___..\
       ;-.___.-;
      (| e ) e |)     .;.
       \  /_   /      ||||
       _\__-__/_    (\|'-|
     /' / \V/ \ '\   \ )/
    /   \  Y  /   \  /=/
   /  |  \ | / {}  \/ /
  /  /|   '|'   |\   /
  \  \|    |.   | \_/
   \ /\    |.   |
    \_/\   |.   |
    /)_/   |    |
   // ',__.'.__,'
  //   |   |   |
 //    |   |   |
(/     |   |   |
       |   |   |
       | _ | _ |
       |   |   |
       |   |   |
       |   |   |
       |___|___|
       /  / \  \
      (__/   \__)
  `;

  secretaresse: string = String.raw`
               ,{{}}}}}}.
              {{{{{}}}}}}}.
             {{{{  {{{{{}}}}
            }}}}} _   _ {{{{{
            }}}}  m   m  }}}}}
           {{{{C    ^    {{{{{
          }}}}}}\  '='  /}}}}}}
         {{{{{{{{;.___.;{{{{{{{{
         }}}}}}}}})   (}}}}}}}}}}
        {{{{}}}}}':   :{{{{{{{{{{
        {{{}}}}}}  '@' {{{}}}}}}}
         {{{{{{{{{    }}}}}}}}}
           }}}}}}}}  {{{{{{{{{
            {{{{{{{{  }}}}}}
               }}}}}  {{{{
                {{{    }}
  `;

  colaMentos: string = String.raw`
  .      .       .       .
  .   .       .          .      . .      .         .          .    .
         .       .         .    .   .         .         .            .
    .   .    .       .         . . .        .        .     .    .
 .          .   .       .       . .      .        .  .              .
      .  .    .  .       .     . .    .       . .      .   .        .
 .   .       .    . .      .    . .   .      .     .          .     .
    .            .    .     .   . .  .     .   .               .
     .               .  .    .  . . .    .  .                 .
                        . .  .  . . .  . .
                            . . . . . .
                              . . . .
                            |_-_-_-_-_|
                            |_________|
                             )_______(
                            (_________)
                            |         |
                            /         \
                           /           \
                          /             \
                         /               \
                        /                 \
                       /                   \
                      (_____________________)
                       )___________________(
                      (_____________________)
                      |                     |
                      |_____________________|
                       )___________________(
                      |_____________________|
                       )___________________(
                      |                     |
                      |_____________________|
                       )___________________(
                      |_____________________|
                       )___________________(
                      |                     |
                      |                     |
                      |_____________________|
                      (_____________________)
                      |_____________________|
                      (_____________________)
                      |                     |
                      |                     |
                      \_____________________/
                       '-------------------'
  `;

  liftCode: string = String.raw`
  .----------------------------------.
  |                                  |
  |           --   CODE    --        |
  |                                  |
  |  .-----, .-----, .-----, .-----, |
  |  |  7  | |  8  | |  9  | |  x  | |
  |  '-----' '-----' '-----' '-----' |
  |  .-----, .-----, .-----, .-----, |
  |  |  4  | |  5  | |  6  | |  -  | |
  |  '-----' '-----' '-----' '-----' |
  |  .-----, .-----, .-----, .-----, |
  |  |  1  | |  2  | |  3  | |     | |
  |  '-----' '-----' '-----' '-----' |
  |  .-----, .-----, .-----, .-----, |
  |  | ON  | |  0  | |  .  | | (-) | |
  |  '-----' '-----' '-----' '-----' |
  |  .-----------------------------. |
  |  |                             | |
  |  |   Hoeveel keer komt 5 voor  | |
  |  |  in de getallen 0 tot 100?  | |
  |  |                             | |
  |  '-----------------------------' |
  '----------------------------------'
`;

  firework: string = String.raw`
                                     .''.       
       .''.      .        *''*    :_\/_:     . 
      :_\/_:   _\(/_  .:.*_\/_*   : /\ :  .'.:.'.
  .''.: /\ :   ./)\   ':'* /\ * :  '..'.  -=:o:=-
 :_\/_:'.:::.    ' *''*    * '.\'/.' _\(/_'.':'.'
 : /\ : :::::     *_\/_*     -= o =-  /)\    '  *
  '..'  ':::'     * /\ *     .'/.\'.   '
      *            *..*         :
     *
        *
  `;

}



