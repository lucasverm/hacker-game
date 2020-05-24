import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { take } from 'rxjs/operators';

import { Data } from '../data';
import { Regel } from '../regel';
import { DataService } from '../services/data.service';
import * as moment from 'moment';

@Component({
  selector: "app-level1",
  templateUrl: "./level1.component.html",
  styleUrls: ["./level1.component.scss"],
})
export class Level1Component implements OnInit {
  title = "hacker-game";
  public inputForm: FormGroup;
  data: Data;
  constructor(
    public router: Router,
    private fb: FormBuilder,
    public dataService: DataService
  ) {}

  //deze mothode wordt uigevoerd bij het openen van de pagina
  ngOnInit() {
    this.dataService.dataSource$.pipe(take(1)).subscribe((item) => {
      this.data = item;

      if (!this.data.welkomsBerichtGetoond) {
        this.welkomstBericht();
        this.data.welkomsBerichtGetoond = true;
        this.updateData();
      }
    });
    //onbelangrijk voor jou
    this.inputForm = this.fb.group({
      input: [""],
    });
  }

  ngAfterViewInit() {
    document.getElementById("input").focus();
  }

  updateData() {
    this.dataService.updateData(this.data);
  }

  getLocatie() {
    if (this.data.huidigePlaats == "inkom") {
      return "inkom";
    } else if (this.data.huidigePlaats == "voor de deur") {
      return `${this.data.huidigePlaats}`;
    } else {
      return `inkom > ${this.data.huidigePlaats}`;
    }
  }

  toonRugzak() {
    var uitvoer = "Rugzak: ";
    this.data.rugzak.forEach((t) => {
      uitvoer += t + ", ";
    });
    uitvoer += `${this.data.bedragInRugzak} euro`;

    this.maakRegel("MACHINE", uitvoer);
  }

  toonInformatie(input: string) {
    if (this.data.huidigLevel == 0) {
      this.level0(input);
    } else if (this.data.huidigLevel == 1) {
      this.level1(input);
    }
  }

  help() {
    this.maakRegel(
      "MACHINE",
      "HELP \n - in je rugzak kijken: typ 'rugzak' \n - informatie krijgen over huidige plaats: typ 'informatie' \n - terug: typ 'terug'"
    );
  }

  spel(input: string) {
    if (this.data.voornaam == null) {
      this.data.voornaam = input;
      this.geefInstructies();
    } else if (input == "rugzak") {
      this.toonRugzak();
    } else if (input == "restart") {
      this.data = new Data();
      this.welkomstBericht();
      this.data.welkomsBerichtGetoond = true;
      this.updateData();
    } else if (input == "help") {
      this.help();
    } else if (input == "informatie") {
      this.toonInformatie(input);
    } else if (this.data.huidigLevel == 0) {
      this.level0(input);
    } else if (this.data.huidigLevel == 1) {
      this.level1(input);
    }
  }

  level0(input: string) {
    if (input == "ga binnen") {
      this.data.huidigLevel = 1;
      this.data.huidigePlaats = "inkom";

      this.spel(input);
    } else if (input == "informatie") {
      this.maakRegel(
        "MACHINE",
        'Om het gebouw binnen te stappen: typ: "ga binnen".'
      );
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  level1(input: string) {
    if (this.data.huidigePlaats == "inkom") {
      this.level1Inkom(input);
    } else if (this.data.huidigePlaats == "zetel") {
      this.level1Zetel(input);
    } else if (this.data.huidigePlaats == "automaat") {
      this.level1Automaat(input);
    } else if (this.data.huidigePlaats == "lift") {
      this.level1Lift(input);
    } else if (this.data.huidigePlaats == "bewaker") {
      this.level1Bewaker(input);
    } else if (this.data.huidigePlaats == "secretaresse") {
      this.level1Secretaresse(input);
    }
  }

  level1Inkom(input: string) {
    if (
      input == "ga naar zetel" ||
      input == "ga naar een zetel" ||
      input == "ga naar de zetel"
    ) {
      this.level1Zetel(input);
    } else if (
      input == "ga naar automaat" ||
      input == "ga naar een automaat" ||
      input == "ga naar de automaat"
    ) {
      this.level1Automaat(input);
    } else if (
      input == "ga naar lift" ||
      input == "ga naar een lift" ||
      input == "ga naar de lift"
    ) {
      this.data.huidigePlaats = "lift";

      this.level1Lift(input);
    } else if (
      input == "ga naar secretaresse" ||
      input == "ga naar een secretaresse" ||
      input == "ga naar de secretaresse"
    ) {
      this.data.huidigePlaats = "secretaresse";

      this.level1Secretaresse(input);
    } else if (
      input == "ga naar bewaker" ||
      input == "ga naar een bewaker" ||
      input == "ga naar de bewaker"
    ) {
      this.data.huidigePlaats = "bewaker";

      this.level1Bewaker(input);
    } else if (input == "terug") {
      this.level1Inkom("ga binnen");
      this.maakRegel("MACHINE", "Op dit moment kan je niet terug!");
    } else if (input == "ga binnen" || input == "informatie") {
      this.data.huidigePlaats = "inkom";

      if (this.data.startKlok == null) {
        this.data.startKlok = moment();
      }
      this.maakRegel(
        "MACHINE",
        'Je staat nu in de inkomhal van de bank. Je ziet: \n\
      - een LIFT \n\
      - een BEWAKER\n\
      - een ZETEL\n\
      - een SECRETARESSE\n\
      - een AUTOMAAT\n\n\
    typ "ga naar ..." om je te verplaatsen\n'
      );
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  level1Lift(input: string) {
    if (
      input == "ga naar lift" ||
      input == "ga naar een lift" ||
      input == "ga naar de lift" ||
      input == "informatie"
    ) {
      this.data.huidigePlaats = "lift";

      this.maakRegel("", this.lift, "art");
      if (!this.data.bewakerAfgeleid) {
        this.maakRegel(
          "MACHINE",
          'Bewaker: "Hela jongeman, deze toegang is niet voor onbevoegden!"\n\
        COMMANDOS:\n\
        - terug'
        );
      } else {
        this.maakRegel("MACHINE", "COMMANDO'S:\n - Open lift");
      }
    } else if (input == "open lift") {
      if (this.data.bewakerAfgeleid) {
        this.data.inLift = true;

        this.maakRegel("", this.liftCode, "art");
        this.maakRegel("MACHINE", "Je staat nu in de lift en ziet dit:");
      } else {
        this.level1Lift("error");
      }
    } else if (input == "20") {
      if (this.data.inLift) {
        this.maakRegel("", this.firework, "art");
        this.maakRegel(
          "MACHINE",
          "Proficiat! Je activeerde de lift! De lift gaat nu naar boven en je komt terecht op het 2de verdiep. Succes!!"
        );
        this.data.huidigLevel = 2;
        this.router.navigate([`../level-2`]);
      } else {
        this.level1Lift("error");
      }
    } else if (input == "terug") {
      this.data.huidigePlaats = "inkom";

      this.level1Inkom("ga binnen");
    } else {
      if (this.data.inLift) {
        this.maakRegel(
          "MACHINE",
          "Deze gok is fout. Probeer opnieuw!",
          "error"
        );
      } else {
        this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
      }
    }
  }

  level1Bewaker(input: string) {
    if (
      input == "ga naar bewaker" ||
      input == "ga naar een bewaker" ||
      input == "ga naar de bewaker" ||
      input == "informatie"
    ) {
      this.data.huidigePlaats = "bewaker";

      this.maakRegel("", this.bewaker, "art");
      if (
        this.data.rugzak.includes("mentos") &&
        this.data.rugzak.includes("cola")
      ) {
        this.maakRegel(
          "MACHINE",
          "Amai, azo nen peet! Jawadde dadde! Hij houdt de inkomhal goed in de gaten. Hij zorgt ervoor dat er geen geld wordt gestolen of mensen zomaar de bank binnen lopen. Hier geraak je niet zomaar voorbij hoor! \n\
      COMMANDO'S: \n\
        - leid af met cola en mentos\n\
        - vraag waar het toilet is\n\
        - verkoop aansteker\n\
        - terug"
        );
      } else {
        this.maakRegel(
          "MACHINE",
          "Amai, azo nen peet! Jawadde dadde! Hij houdt de inkomhal goed in de gaten. Hij zorgt ervoor dat er geen geld wordt gestolen of mensen zomaar de bank binnen lopen. Hier geraak je niet zomaar voorbij hoor! \n\
      COMMANDO'S: \n\
          - vraag waar het toilet is\n\
          - verkoop aansteker\n\
          - terug"
        );
      }
    } else if (input == "leid af met cola en mentos") {
      this.data.bewakerAfgeleid = true;
      this.maakRegel("", this.colaMentos, "art");
      this.data.rugzak.splice(this.data.rugzak.indexOf("cola"), 1);
      this.data.rugzak.splice(this.data.rugzak.indexOf("mentos"), 1);

      this.maakRegel(
        "MACHINE",
        "Je steekt het volledige pakje mentos in het cola flesje, en zet het net achter de bewaker. Psssssssst! Alles begint te spuiten, een ware fontein!\
        De bewaker kijkt je verschrikt aan, maar jij loopt nonchalant verder. Niemand zag het je doen. Wat heb jij chance!! De bewaker hangt helemaal vol plakkende cola en druipt af naar het toilet om zijn kleren proper te maken.\n\
        COMMANDOS:\n\
        - terug"
      );
    } else if (
      input == "vraag waar toilet is" ||
      input == "vraag waar het toilet is"
    ) {
      this.maakRegel(
        "MACHINE",
        'Bewaker: "Het toilet is hier naast de lift naar rechts. Goed mikken hé, we zijn hier niet op scoutskamp!\n\
      COMMANDOS:\n\
      - terug'
      );
    } else if (
      input == "verkoop aansteker" ||
      input == "verkoop de aansteker"
    ) {
      this.maakRegel(
        "MACHINE",
        `Bewaker: "Ah toeme, ik heb geen geld op zak!\n\
      COMMANDOS:\n\
      - terug`
      );
    } else if (input == "terug") {
      this.data.huidigePlaats = "inkom";

      this.level1Inkom("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  level1Secretaresse(input: string) {
    if (
      input == "ga naar secretaresse" ||
      input == "ga naar een secretaresse" ||
      input == "ga naar de secretaresse" ||
      input == "informatie"
    ) {
      this.data.huidigePlaats = "secretaresse";

      this.maakRegel("", this.secretaresse, "art");
      this.maakRegel(
        "MACHINE",
        "De secretaresse heeft mooie, blond-bruine krullen. Ze heeft een fleurige blouse en een snoepjesketting aan en kauwgomt er op los, een ware streling voor het oog! 1.5 meter afstand houden!\n\
      COMMANDO'S: \n\
        - vraag waar het toilet is\n\
        - verkoop aansteker\n\
        - terug"
      );
    } else if (
      input == "vraag waar toilet is" ||
      input == "vraag waar het toilet is"
    ) {
      this.maakRegel(
        "MACHINE",
        'Secretaresse: "Het toilet is naast de lift naar rechts. Gelieve je handen goed te wassen in verband met de huidige coronamaatregelen!"\n\
      COMMANDO\'S: \n\
        - vraag waar het toilet is\n\
        - verkoop aansteker\n\
        - terug'
      );
    } else if (
      input == "verkoop aansteker" ||
      input == "verkoop de aansteker"
    ) {
      this.maakRegel(
        "MACHINE",
        `Secretaresse: "Sorry, ${this.data.voornaam}. Ik kan geen aansteker gebruiken. Ik kan je niet helpen."\n\
      COMMANDO'S: \n\
        - vraag waar het toilet is\n\
        - verkoop aansteker\n\
        - terug`
      );
    } else if (input == "terug") {
      this.data.huidigePlaats = "inkom";

      this.level1Inkom("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  level1Zetel(input: string) {
    if (
      input == "ga naar zetel" ||
      input == "ga naar een zetel" ||
      input == "ga naar de zetel" ||
      input == "informatie"
    ) {
      this.data.huidigePlaats = "zetel";
      this.maakRegel("", this.sofaArt, "art");
      if (!this.data.muntstukGevonden) {
        this.maakRegel(
          "MACHINE",
          `Je zit op een rode zetel, gemaakt door de beroemde kunstenaar Charles Rennie Mackintosh. De zetel werd ontworpen in 1983. Boven jou hangt een kunstwerk van Panamarenko. Op het kaartje dat erbij hangt, staat er dat het om de aeromodeller blijkt te gaan, een reusachtige heteluchballon gemaakt rond 1970. Wat een gigantisch kunstwerk! Je ziet een centje blinken tussen de kussens van de zetel.\n\
       - muntstuk oprapen\n\
       - terug`
        );
      } else {
        this.maakRegel(
          "MACHINE",
          `Je zit op een rode zetel, gemaakt door de beroemde kunstenaar Charles Rennie Mackintosh. De zetel werd ontworpen in 1983. Boven jou hangt een kunstwerk van Panamarenko. Op het kaartje dat erbij hangt, staat er dat het om de aeromodeller blijkt te gaan, een reusachtige heteluchballon gemaakt rond 1970. Wat een gigantisch kunstwerk!\n\
       - terug`
        );
      }
    } else if (input == "muntstuk oprapen") {
      if (!this.data.muntstukGevonden) {
        this.maakRegel("", this.euro, "art");
        this.maakRegel(
          "MACHINE",
          "Amai! Je vindt zomaar een muntstuk van 2 euro tussen de zetel! It's your lucky day! Je steekt het muntstuk in je rugzak. \n\
      - rugzak\n\
      - terug"
        );
        this.data.muntstukGevonden = true;
        this.data.bedragInRugzak = 2;
      } else {
        this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
      }
    } else if (input == "terug") {
      this.data.huidigePlaats = "inkom";

      this.level1Inkom("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  level1Automaat(input: string) {
    if (
      input == "ga naar automaat" ||
      input == "ga naar een automaat" ||
      input == "ga naar de automaat" ||
      input == "informatie"
    ) {
      this.data.huidigePlaats = "automaat";
      this.maakRegel("", this.machine, "art");
      this.maakRegel(
        "MACHINE",
        `Je staat voor een automaat. Deze automaat is rood en wit en ziet er al wat versleten uit. Hij is bijna leeg. Inhoud: \n\
      - COLA: 1,20 euro\n\
      - WAFEL: 2,20 euro\n\
      - MENTOS: 0,70 euro\n\n\
      COMMANDO'S: \n\
      - bonk op automaat\n\
      - steek x euro in automaat
      - bedrag in automaat
      - haal geld uit automaat
      - koop ...
      - terug`
      );
    } else if (input == "bedrag in automaat") {
      this.maakRegel(
        "MACHINE",
        `Er zit momenteel ${this.data.bedragInAutomaat} euro in de automaat.`
      );
    } else if (input == "haal geld uit automaat") {
      if (this.data.bedragInAutomaat == 0) {
        this.maakRegel("MACHINE", `Helaas, er zit geen geld in de automaat.`);
      } else {
        this.data.bedragInRugzak += this.data.bedragInAutomaat;
        this.maakRegel(
          "MACHINE",
          `Je haalde ${this.data.bedragInAutomaat} euro uit de automaat.`
        );
        this.data.bedragInAutomaat = 0;
      }
    } else if (input == "koop mentos") {
      if (this.data.rugzak.includes("mentos")) {
        this.maakRegel("MACHINE", "De mentos is op!");
      } else if (this.data.bedragInAutomaat >= 0.7) {
        this.data.bedragInAutomaat -= 0.7;
        this.data.rugzak.push("mentos");
        this.maakRegel(
          "MACHINE",
          "Je kocht mentos uit de automaat. Deze zit nu in je rugzak."
        );
      } else {
        this.maakRegel("MACHINE", "Er zit onvoldoende geld in de automaat.");
      }
    } else if (input == "koop cola") {
      if (this.data.bedragInAutomaat >= 1.2) {
        this.data.bedragInAutomaat -= 1.2;
        this.data.rugzak.push("cola");
        this.maakRegel(
          "MACHINE",
          "Je kocht cola uit de automaat. Deze zit nu in je rugzak."
        );
      } else {
        this.maakRegel("MACHINE", "Er zit onvoldoende geld in de automaat.");
      }
    } else if (input == "koop wafel") {
      this.maakRegel("MACHINE", "Er zit onvoldoende geld in de automaat.");
    } else if (input == "bonk op automaat") {
      this.maakRegel(
        "MACHINE",
        "Er viel niks uit de automaat.. De bewaker kijkt je boos aan! Opgelet!"
      );
      //kijkt of de volgende woorden in de input staan
    } else if (
      ["steek", "euro", "in", "automaat"].every((i) =>
        input.split(" ").includes(i)
      )
    ) {
      const bedrag: number = parseFloat(input.split(" ")[1].replace(",", "."));
      if (!isNaN(bedrag)) {
        if (bedrag > this.data.bedragInRugzak) {
          this.maakRegel(
            "MACHINE",
            "Je hebt onvoldoende geld op zak om in de automaat te steken."
          );
        } else {
          this.data.bedragInAutomaat += bedrag;
          this.data.bedragInRugzak -= bedrag;
          this.maakRegel("MACHINE", `Je stak ${bedrag} euro in de automaat.`);
        }
      } else {
        this.maakRegel("MACHINE", `Dit bedrag is ongeldig!`);
      }
    } else if (input == "terug") {
      this.data.huidigePlaats = "inkom";
      this.level1Inkom("ga binnen");
    } else {
      this.maakRegel("MACHINE", "Dit commando is ongeldig!", "error");
    }
  }

  enter() {
    //haalt input uit het inputveld en zet het in de input VARiable
    var input = this.inputForm.value.input.toLowerCase().trim();
    this.maakRegel(this.data.voornaam, input);
    this.inputForm.get("input").setValue("");
    this.spel(input);
    this.updateData();
  }

  down() {
    if (this.data.downNummer > -1) {
      this.data.downNummer--;
    }
    if (this.data.gebruikersInvoer()[this.data.downNummer] != null) {
      this.inputForm
        .get("input")
        .setValue(this.data.gebruikersInvoer()[this.data.downNummer].tekst);
    }
  }
  up() {
    if (this.data.downNummer < this.data.gebruikersInvoer().length) {
      this.data.downNummer++;
    }
    if (this.data.gebruikersInvoer()[this.data.downNummer] != null) {
      this.inputForm
        .get("input")
        .setValue(this.data.gebruikersInvoer()[this.data.downNummer].tekst);
    } else {
      this.inputForm.get("input").setValue("");
    }
  }

  geefInstructies() {
    this.maakRegel("", this.bank, "art");
    this.maakRegel(
      "MACHINE",
      `Dag ${this.data.voornaam}, Welkom in deze virtuele escape room. Door de huidige Covid - 19 pandemie konden veel activiteiten niet doorgaan en zitten veel verenigingen krap bij kas. Daarom gaan we op zoek naar andere manieren om onze werkingen te kunnen blijven voortzetten. We hebben jou nodig om ons te helpen.\n\n\
    Op dit moment sta je voor een bank. Dit gebouw heeft verschillende verdiepingen. Jij staat nu buiten, voor het gebouw. Door aan dit systeem commando's te geven, kan je zelf beslissen naar waar je gaat en wat je doet. Ook heb je op dit moment een rugzak aan. Daarin zitten spullen die je hoogstwaarschijnlijk kunnen helpen op je missie. Lees alle tekstjes erg goed!\n\n\
     - Om de rugzak te openen: typ \"rugzak\". \n\
     - Heb je informatie nodig over je huidige omgeving: typ \"informatie\". \n\
     - Heb je hulp nodig bij de commando's: typ \"help\". \n\
     - (optie) Met je pijltjes haal je je laatste commando's terug in het input veld. \n\
     - (optie) Herstart het spel met \"restart\". \n\
     Alles zal wel duidelijk worden. Zodra je het gebouw binnenstapt, begint jouw klok te lopen! Probeer een snelle tijd neer te zetten! Succes! Deze applicatie werd geschreven door Lucas Vermeulen. (Een fout gevonden? Meld op escape-room@ardu.be!)\n\n\
    Om het gebouw binnen te stappen: typ: \"ga binnen\".`
    );
  }

  welkomstBericht() {
    this.maakRegel("", this.scoutsArduHackSpel, "art");
    this.maakRegel(
      "MACHINE",
      "Welkom op de online escape room van Scouts Rutten. De bedoeling is dat jij onze scouts helpt door te hacken! Volg de vragen, en denk goed na! Voor de visualiteit raden we aan om het spel op de computer te spelen. Veel escape plezier! Deze applicatie werd geschreven door Lucas Vermeulen. (Een fout gevonden? Meld op escape-room@ardu.be!)"
    );
    this.maakRegel("MACHINE", "Geef je voornaam in: ");
  }

  //maakt een regel aan en schrijft die naar de uitvoer
  maakRegel(uitvoerder: string, text: string, type: string = "normaal") {
    var regel = new Regel();
    regel.uitvoerder = uitvoerder;
    regel.tekst = text;
    regel.type = type;
    this.data.uitvoerData.push(regel);
    if (uitvoerder == this.data.voornaam) {
      this.data.downNummer = this.data.gebruikersInvoer().length;
    }
  }

  scoutsArduHackSpel = String.raw`
  ███████╗ ██████╗ ██████╗ ██╗   ██╗████████╗███████╗    ██████╗ ██╗   ██╗████████╗████████╗███████╗███╗   ██╗
  ██╔════╝██╔════╝██╔═══██╗██║   ██║╚══██╔══╝██╔════╝    ██╔══██╗██║   ██║╚══██╔══╝╚══██╔══╝██╔════╝████╗  ██║
  ███████╗██║     ██║   ██║██║   ██║   ██║   ███████╗    ██████╔╝██║   ██║   ██║      ██║   █████╗  ██╔██╗ ██║
  ╚════██║██║     ██║   ██║██║   ██║   ██║   ╚════██║    ██╔══██╗██║   ██║   ██║      ██║   ██╔══╝  ██║╚██╗██║
  ███████║╚██████╗╚██████╔╝╚██████╔╝   ██║   ███████║    ██║  ██║╚██████╔╝   ██║      ██║   ███████╗██║ ╚████║
  ╚══════╝ ╚═════╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝    ╚═╝  ╚═╝ ╚═════╝    ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═══╝
                                                                                                              
  ███████╗███████╗ ██████╗ █████╗ ██████╗ ███████╗    ██████╗  ██████╗  ██████╗ ███╗   ███╗                   
  ██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝    ██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║                   
  █████╗  ███████╗██║     ███████║██████╔╝█████╗      ██████╔╝██║   ██║██║   ██║██╔████╔██║                   
  ██╔══╝  ╚════██║██║     ██╔══██║██╔═══╝ ██╔══╝      ██╔══██╗██║   ██║██║   ██║██║╚██╔╝██║                   
  ███████╗███████║╚██████╗██║  ██║██║     ███████╗    ██║  ██║╚██████╔╝╚██████╔╝██║ ╚═╝ ██║                   
  ╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝    ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝                                                                                                                              
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
  |#|  |    |                   |##| Steek  |##|
  |#|  |COCA|   ___      __     |##| Geld   |##|
  |#|  |COLA|  / __\    / __\   |##| Gleuf! |##|
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

  bewaker: string = String.raw`
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

  sofaArt: string = String.raw`
  .--------------.--------------.
  |              |              |
  |              |              |
  |              |              |
  |______________|_________*____|
  /                             \
 /                               \
/_________________________________\
|                                 |
|_________________________________|
[]                               []
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
