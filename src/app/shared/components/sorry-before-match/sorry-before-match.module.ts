import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SorryBeforeMatchComponent} from "./sorry-before-match.component";


@NgModule({
  declarations: [SorryBeforeMatchComponent],
  imports: [
    CommonModule
  ],
  exports: [
    SorryBeforeMatchComponent,
  ]
})
export class SorryBeforeMatchModule { }
