import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDetailFemalePage } from './user-detail-female.page';

const routes: Routes = [
  {
    path: '',
    component: UserDetailFemalePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDetailFemalePageRoutingModule {}
