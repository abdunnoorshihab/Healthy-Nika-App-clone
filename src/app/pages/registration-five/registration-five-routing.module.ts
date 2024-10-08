import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationFivePage } from './registration-five.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationFivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationFivePageRoutingModule {}
