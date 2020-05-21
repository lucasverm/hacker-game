import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UitvoerComponent } from './uitvoer/uitvoer.component';
import { Level1Component } from './level1/level1.component';
import { Level2Component } from './level2/level2.component';
import { LaptopComponent } from './laptop/laptop.component';
import { CertificaatComponent } from './certificaat/certificaat.component';
@NgModule({
  declarations: [
    AppComponent,
    UitvoerComponent,
    Level1Component,
    Level2Component,
    LaptopComponent,
    CertificaatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
