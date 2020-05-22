import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DataService } from '../services/data.service';
import * as moment from 'moment';
import { Data } from '../data';

@Component({
  selector: 'app-certificaat',
  templateUrl: './certificaat.component.html',
  styleUrls: ['./certificaat.component.scss']
})
export class CertificaatComponent implements OnInit {

  data: Data;
  constructor(public router: Router, private fb: FormBuilder, public dataService: DataService) { }

  ngOnInit() {
    this.dataService.dataObserver$.subscribe(item => {
      this.data = item;
    });
    this.berekenTijd();
  }

  berekenTijd() {
    var verschil = this.data.eindKlok.diff(this.data.startKlok);
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
