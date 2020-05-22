import { Component, OnInit, Input } from '@angular/core';
import { Regel } from '../regel';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';
import { DataService } from '../services/data.service';
import { Data } from '../data';

@Component({
  selector: 'app-uitvoer',
  templateUrl: './uitvoer.component.html',
  styleUrls: ['./uitvoer.component.scss']
})
export class UitvoerComponent implements OnInit {

  data: Data;

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.dataService.dataObserver$.subscribe(item => {
      this.data = item;
    });
  }
}
