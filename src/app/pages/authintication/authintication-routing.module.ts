import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthinticationPage } from './authintication.page';

const routes: Routes = [
  {
    path: '',
    component: AuthinticationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthinticationPageRoutingModule {}
