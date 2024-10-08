import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationThreePage } from './registration-three.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationThreePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationThreePageRoutingModule {}
