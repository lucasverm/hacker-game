import { Component, OnInit, Input } from '@angular/core';
import { Regel } from '../regel';

@Component({
  selector: 'app-uitvoer',
  templateUrl: './uitvoer.component.html',
  styleUrls: ['./uitvoer.component.scss']
})
export class UitvoerComponent implements OnInit {

  @Input() data: Regel[];
  constructor() { }
  ngOnInit() {
  }
}
