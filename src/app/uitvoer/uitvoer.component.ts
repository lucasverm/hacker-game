import { Component, OnInit } from '@angular/core';

import { Data } from '../data';
import { DataService } from '../services/data.service';

@Component({
  selector: "app-uitvoer",
  templateUrl: "./uitvoer.component.html",
  styleUrls: ["./uitvoer.component.scss"],
})
export class UitvoerComponent implements OnInit {
  data: Data;

  constructor(public dataService: DataService) {}

  ngOnInit() {
    this.dataService.dataSource$.subscribe((item) => {
      this.data = item;
    });
  }
}
