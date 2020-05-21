import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-certificaat',
  templateUrl: './certificaat.component.html',
  styleUrls: ['./certificaat.component.scss']
})
export class CertificaatComponent implements OnInit {

  constructor(public router: Router, private fb: FormBuilder, public dataService: DataService) { }

  ngOnInit() {
  }

}
