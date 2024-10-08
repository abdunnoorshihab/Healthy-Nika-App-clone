import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchCreditsPage } from './match-credits.page';

const routes: Routes = [
  {
    path: '',
    component: MatchCreditsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchCreditsPageRoutingModule {}
