import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {Registration1PageRoutingModule} from './registration1-routing.module';

import {Registration1Page} from './registration1.page';
import {RouterModule} from '@angular/router';
import {MaterialModule} from "../../material/material.module";
import {PipesModule} from "../../shared/pipes/pipes.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        Registration1PageRoutingModule,
        RouterModule,
        ReactiveFormsModule,
        MaterialModule,
        PipesModule,
    ],
  declarations: [Registration1Page]
})
export class Registration1PageModule {}
