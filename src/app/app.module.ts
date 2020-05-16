import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UitvoerComponent } from './uitvoer/uitvoer.component';
import { Level1Component } from './level1/level1.component';
@NgModule({
  declarations: [
    AppComponent,
    UitvoerComponent,
    Level1Component
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
