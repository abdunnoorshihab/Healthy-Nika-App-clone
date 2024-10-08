import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileListPartCardComponent } from './profile-list-part-card.component';
import {RouterModule} from "@angular/router";
import {PipesModule} from "../../pipes/pipes.module";



@NgModule({
  declarations: [
    ProfileListPartCardComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        PipesModule,
    ],
  exports:[
    ProfileListPartCardComponent
  ]
})
export class ProfileListPartCardModule { }
