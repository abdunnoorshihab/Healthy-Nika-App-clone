import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationFourPage } from './registration-four.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationFourPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationFourPageRoutingModule {}
