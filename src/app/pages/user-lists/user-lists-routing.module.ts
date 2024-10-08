import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserListsPage } from './user-lists.page';

const routes: Routes = [
  {
    path: '',
    component: UserListsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserListsPageRoutingModule {}
