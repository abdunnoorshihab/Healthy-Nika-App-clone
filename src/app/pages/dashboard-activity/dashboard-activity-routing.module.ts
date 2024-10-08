import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardActivityPage } from './dashboard-activity.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardActivityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardActivityPageRoutingModule {}
