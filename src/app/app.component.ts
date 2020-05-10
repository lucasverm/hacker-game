import { Component, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hacker-game';
  public inputForm: FormGroup;
  uitvoer: string = "";
  voornaam: string = null;
  opdracht1Klaar: Boolean = false;

  constructor(public router: Router, private fb: FormBuilder) { }


  ngOnInit() {
    this.inputForm = this.fb.group({
      input: [""]
    })
    //this.inputForm.value.input.focus();
    this.welkomstBericht();
  }

  geefOpdracht() {
    if (this.opdracht1Klaar == false) {
      this.opdracht1();
    }
  }
  spel(input: string) {
    if (this.voornaam == null) {
      this.voornaam = input;
      this.opdracht1();
    } else if (this.opdracht1Klaar == false) {
      if (input == "679") {
        this.addText(`MACHINE> Juist! We gaan verder`);
      } else {
        this.addText(`MACHINE> Fout: probeer opnieuw. Typ \"opdracht\" om de opdracht opnieuw te lezen.`);
      }
    }
  }

  opdracht1() {
    this.addText(`MACHINE> Welkom, ${this.voornaam}. Hiervolgt de eerste opdracht: \n\
      Het systeem is ontgrendeld. Geef de pincode in:\n\
      --> 147: één cijfer juist. Verkeerde plaats. \n\
      --> 189: één cijfer juist. Juiste plaats. \n\
      --> 964: twee cijfer juist. Verkeerde plaats. \n\
      --> 523: Alle cijfers zijn fout \n\
      --> 286: één cijfer juist. Verkeerde plaats. \n`);
  }

  enter() {
    var input = this.inputForm.value.input;
    this.addText(this.voornaam ? `${this.voornaam}> ${input}` : `> ${input}`);
    this.inputForm.get('input').setValue("");
    if (input == "opdracht") {
      this.geefOpdracht();
      return
    }
    this.spel(input);
  }

  welkomstBericht() {
    this.addText("\n\n\
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
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n\
    ");

    this.addText("MACHINE> Welkom op het hackspel van Scouts ardu. De bedoeling is dat jij onze scouts hackt! Volg de vragen, en denk goed na! Zorg dat je de pagina NIET refreshed! Veel hackplezier!!");
    this.addText("MACHINE> Geef je voornaam in:");
  }

  addText(text: string) {
    this.uitvoer = '\n' + text + '\n' + this.uitvoer;
  }
}


