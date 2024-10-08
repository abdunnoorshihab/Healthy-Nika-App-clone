import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchableSelectComponent } from './searchable-select.component';



@NgModule({
  declarations: [SearchableSelectComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports:[
    SearchableSelectComponent
  ]
})
export class SearchableSelectModule { }
