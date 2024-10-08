import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NationalitySearchComponent} from "./nationality-search.component";



@NgModule({
  declarations: [
    NationalitySearchComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    NationalitySearchComponent
  ]
})
export class NationalitySearchModule { }
