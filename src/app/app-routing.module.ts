import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Level1Component } from './level1/level1.component';


const routes: Routes = [{
  path: 'level-1',
  component: Level1Component
},
{
  path: '',
  redirectTo: 'level-1',
  pathMatch: "full"
},
{
  path: '**',
  component: Level1Component
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
