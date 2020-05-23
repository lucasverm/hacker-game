import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { take } from 'rxjs/operators';

import { Data } from '../data';
import { DataService } from '../services/data.service';
import * as moment from 'moment';

@Component({
  selector: "app-certificaat",
  templateUrl: "./certificaat.component.html",
  styleUrls: ["./certificaat.component.scss"],
})
export class CertificaatComponent implements OnInit {
  data: Data;
  constructor(
    public router: Router,
    private fb: FormBuilder,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.dataSource$.pipe(take(1)).subscribe((item) => {
      this.data = item;
      if (!this.data.kluisOpen) {
        if (this.data.huidigLevel == 0 || this.data.huidigLevel == 1) {
          this.router.navigate([`../level-1`]);
        } else {
          this.router.navigate([`../level-2`]);
        }
      } else {
        this.berekenTijd();
      }
    });
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
    uitvoer += tempTime.minutes() + "min ";
    if (tempTime.seconds().toString().length == 1) {
      uitvoer += "0";
    }
    uitvoer += tempTime.seconds() + "sec";
    return uitvoer;
  }
}
