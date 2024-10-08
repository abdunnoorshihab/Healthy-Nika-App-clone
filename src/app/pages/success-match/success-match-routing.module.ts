import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuccessMatchPage } from './success-match.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessMatchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessMatchPageRoutingModule {}
