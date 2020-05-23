import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { take } from 'rxjs/operators';

import { Data } from '../data';
import { DataService } from '../services/data.service';

@Component({
  selector: "app-laptop",
  templateUrl: "./laptop.component.html",
  styleUrls: ["./laptop.component.scss"],
})
export class LaptopComponent implements OnInit {
  public hintTonen: Boolean = false;
  public loginForm: FormGroup;
  data: Data;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    public dataService: DataService
  ) {}
  @ViewChild("canvas", { static: false })
  myCanvas: ElementRef<HTMLCanvasElement>;
  errorMessage: string = "";

  ngOnInit(): void {
    this.dataService.dataSource$.pipe(take(1)).subscribe((item) => {
      this.data = item;
    });
    this.loginForm = this.fb.group({
      email: ["sonia@nationalebank.be"],
      passwoord: [""],
    });
  }

  updateData() {
    this.dataService.updateData(this.data);
    this.router.navigate([`../level-2`]);
  }

  signIn() {
    this.errorMessage = "";
    var password = this.loginForm.value.passwoord;
    if (password != "10-09-1968") {
      //if(false){
      this.errorMessage = "Password is niet correct!";
    } else {
      this.data.soniaIngelogd = true;
      this.data.terugVanLaptop = true;
      this.updateData();
    }
  }

  hint() {
    this.hintTonen = !this.hintTonen;
  }

  terug() {
    this.data.terugVanLaptop = true;
    this.updateData();
  }
}
