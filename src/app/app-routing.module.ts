import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Level1Component } from './level1/level1.component';
import { Level2Component } from './level2/level2.component';
import { LaptopComponent } from './laptop/laptop.component';


const routes: Routes = [
  {
    path: 'level-1',
    component: Level1Component
  },
  {
    path: 'laptop',
    component: LaptopComponent
  },
  {
    path: 'level-2',
    component: Level2Component
  },
  {
    path: '',
    redirectTo: 'level-1',
    pathMatch: "full"
  },
  {
    path: '**',
    redirectTo: 'level-1',
    pathMatch: "full"
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
