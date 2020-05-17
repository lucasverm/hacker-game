import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-laptop',
  templateUrl: './laptop.component.html',
  styleUrls: ['./laptop.component.scss']
})
export class LaptopComponent implements OnInit {

  public hintTonen: Boolean = false;
  public loginForm: FormGroup;

  constructor(public router: Router, private fb: FormBuilder, public dataService: DataService) { }
  @ViewChild('canvas', { static: false })
  myCanvas: ElementRef<HTMLCanvasElement>;
  errorMessage: string = "";

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["sonia@nationalebank.be"],
      passwoord: [""]
    })
  }

  signIn() {
    this.errorMessage = "";
    var password = this.loginForm.value.passwoord;
    if (password != "10-09-1968") {
    //if(false){
      this.errorMessage = "Password is niet correct!"
    } else {
      this.dataService.soniaIngelogd = true;
      this.dataService.terugVanLaptop = true;
      this.router.navigate([`../level-2`]);
    }
  }

  hint() {
    this.hintTonen = !this.hintTonen;
  }

  terug() {
    this.dataService.terugVanLaptop = true;
    this.router.navigate([`../level-2`])
  }


}
