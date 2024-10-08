import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {YearsPipe} from "./years.pipe";
import {SafeUrlPipe} from "./safe-url.pipe";
import {HeightConvertPipe} from "./height.pipe";


@NgModule({
  declarations: [
    YearsPipe,
    SafeUrlPipe,
    HeightConvertPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    YearsPipe,
    SafeUrlPipe,
    HeightConvertPipe
  ]
})
export class PipesModule {
}
