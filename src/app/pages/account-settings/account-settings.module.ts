import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountSettingsPageRoutingModule } from './account-settings-routing.module';

import { AccountSettingsPage } from './account-settings.page';
import { PasswordAndSecurityComponent } from './password-and-security/password-and-security.component';
import { HiddenAccountsComponent } from './hidden-accounts/hidden-accounts.component';
import { PauseMyAccountComponent } from './pause-my-account/pause-my-account.component';
import { DeleteMyAccountComponent } from './delete-my-account/delete-my-account.component';
import {BottomNavModule} from "../../shared/components/bottom-nav/bottom-nav.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AccountSettingsPageRoutingModule,
    BottomNavModule,
  ],
  declarations: [
    AccountSettingsPage,
    PasswordAndSecurityComponent,
    HiddenAccountsComponent,
    PauseMyAccountComponent,
    DeleteMyAccountComponent,
  ]
})
export class AccountSettingsPageModule {}
