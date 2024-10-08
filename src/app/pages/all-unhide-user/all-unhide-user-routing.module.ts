import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllUnhideUserPage } from './all-unhide-user.page';

const routes: Routes = [
  {
    path: '',
    component: AllUnhideUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllUnhideUserPageRoutingModule {}
