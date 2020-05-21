import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DataService } from '../services/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-certificaat',
  templateUrl: './certificaat.component.html',
  styleUrls: ['./certificaat.component.scss']
})
export class CertificaatComponent implements OnInit {

  constructor(public router: Router, private fb: FormBuilder, public dataService: DataService) { }

  ngOnInit() {
    this.berekenTijd();

  }

  berekenTijd() {
    var verschil = this.dataService.eindKlok.diff(this.dataService.startKlok);
    var tempTime = moment.duration(verschil);
    var uitvoer = "";
    if (tempTime.hours().toString().length == 1) {
      uitvoer += "0";
    }
    uitvoer += tempTime.hours() + "u ";
    if (tempTime.minutes().toString().length == 1) {
      uitvoer += "0";
    }
    uitvoer += tempTime.minutes() + "min "
    if (tempTime.seconds().toString().length == 1) {
      uitvoer += "0";
    }
    uitvoer += tempTime.seconds() + "sec"
    return uitvoer;
  }



}
