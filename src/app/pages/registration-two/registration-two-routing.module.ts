import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationTwoPage } from './registration-two.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationTwoPageRoutingModule {}
