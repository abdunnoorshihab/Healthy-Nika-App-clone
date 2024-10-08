import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopUpMatchCreditsComponent } from './top-up-match-credits.component';



@NgModule({
  declarations: [TopUpMatchCreditsComponent],
  imports: [
    CommonModule
  ],
  exports:[
    TopUpMatchCreditsComponent,
  ]
})
export class TopUpMatchCreditsModule { }
