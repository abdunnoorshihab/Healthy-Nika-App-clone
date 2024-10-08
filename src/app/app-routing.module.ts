import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserAuthStateGuard } from './auth-guard/user-auth-state.guard';
import { UserAuthState1Guard } from './auth-guard/user-auth-state1.guard';
import { UserAuthGuard } from './auth-guard/user-auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/authintication/authintication.module').then(
        (m) => m.AuthinticationPageModule
      ),
    canActivate: [UserAuthState1Guard],
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [UserAuthGuard],
  },
  {
    path: 'authintication',
    loadChildren: () =>
      import('./pages/authintication/authintication.module').then(
        (m) => m.AuthinticationPageModule
      ),
    canActivate: [UserAuthState1Guard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [UserAuthStateGuard],
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordPageModule
      ),
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('./pages/registration/registration.module').then(
        (m) => m.RegistrationPageModule
      ),
  },
  {
    path: 'registration1',
    loadChildren: () =>
      import('./pages/registration1/registration1.module').then(
        (m) => m.Registration1PageModule
      ),
  },
  {
    path: 'registration2',
    loadChildren: () =>
      import('./pages/registration-two/registration-two-routing.module').then(
        (m) => m.RegistrationTwoPageRoutingModule
      ),
  },
  {
    path: 'registration3',
    loadChildren: () =>
      import('./pages/registration-three/registration-three.module').then(
        (m) => m.RegistrationThreePageModule
      ),
  },
  {
    path: 'registration4',
    loadChildren: () =>
      import('./pages/registration-four/registration-four.module').then(
        (m) => m.RegistrationFourPageModule
      ),
  },
  {
    path: 'registration5',
    loadChildren: () =>
      import('./pages/registration-five/registration-five.module').then(
        (m) => m.RegistrationFivePageModule
      ),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./pages/account/account.module').then((m) => m.AccountPageModule),
    canActivate: [UserAuthGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard-activity/dashboard-activity.module').then(
        (m) => m.DashboardActivityPageModule
      ),
    canActivate: [UserAuthGuard],
  },
  {
    path: 'faq',
    loadChildren: () =>
      import('./pages/faq/faq.module').then((m) => m.FaqPageModule),
  },
  {
    path: 'credits',
    loadChildren: () =>
      import('./pages/credits/credits.module').then((m) => m.CreditsPageModule),
  },
  {
    path: 'edit-profile',
    loadChildren: () =>
      import('./pages/edit-profile/edit-profile-routing.module').then(
        (m) => m.EditProfilePageRoutingModule
      ),
    canActivate: [UserAuthGuard],
  },
  {
    path: 'user-details',
    loadChildren: () =>
      import('./pages/user-detail/user-detail.module').then(
        (m) => m.UserDetailPageModule
      ),
  },
  {
    path: 'user-lists',
    loadChildren: () =>
      import('./pages/user-lists/user-lists.module').then(
        (m) => m.UserListsPageModule
      ),
  },
  {
    path: 'success-match',
    loadChildren: () =>
      import('./pages/success-match/success-match.module').then(
        (m) => m.SuccessMatchPageModule
      ),
  },
  {
    path: 'user-detail-female',
    loadChildren: () =>
      import('./pages/user-detail-female/user-detail-female.module').then(
        (m) => m.UserDetailFemalePageModule
      ),
  },
  {
    path: 'change-password',
    loadChildren: () =>
      import('./pages/change-password/change-password.module').then(
        (m) => m.ChangePasswordPageModule
      ),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./pages/search/search.module').then((m) => m.SearchPageModule),
  },
  {
    path: 'request-list',
    loadChildren: () =>
      import('./pages/request-list/request-list.module').then(
        (m) => m.RequestListPageModule
      ),
  },
  {
    path: 'notification',
    loadChildren: () =>
      import('./pages/notification/notification.module').then(
        (m) => m.NotificationPageModule
      ),
  },
  {
    path: 'contact-us',
    loadChildren: () =>
      import('./pages/contact-us/contact-us.module').then(
        (m) => m.ContactUsPageModule
      ),
  },
  {
    path: 'payment',
    loadChildren: () =>
      import('./pages/payment/payment.module').then((m) => m.PaymentPageModule),
  },
  {
    path: 'profile-list',
    loadChildren: () =>
      import('./pages/profile-list/profile-list.module').then(
        (m) => m.ProfileListPageModule
      ),
  },
  {
    path: 'profile-details/:userId',
    loadChildren: () => import('./pages/profile-details/profile-details.module').then( m => m.ProfileDetailsPageModule)
  },
  {
    path: 'image-modal',
    loadChildren: () => import('./pages/image-modal/image-modal.module').then( m => m.ImageModalPageModule)
  },
  {
    path: 'match-credits',
    loadChildren: () => import('./pages/match-credits/match-credits.module').then( m => m.MatchCreditsPageModule)
  },
  {
    path: 'account-settings',
    loadChildren: () => import('./pages/account-settings/account-settings.module').then( m => m.AccountSettingsPageModule)
  },
  {
    path: 'filters',
    loadChildren: () => import('./pages/filters/filters.module').then( m => m.FiltersPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'all-unhide-user',
    loadChildren: () => import('./pages/all-unhide-user/all-unhide-user.module').then( m => m.AllUnhideUserPageModule)
  },
  {
    path: 'profile-image',
    loadChildren: () => import('./pages/profile-image/profile-image.module').then( m => m.ProfileImagePageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
  providers: [UserAuthGuard, UserAuthStateGuard],
})
export class AppRoutingModule {}
