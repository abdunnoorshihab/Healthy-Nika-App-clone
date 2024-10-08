// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'healthynikah',
  domain: 'healthynikah.com',

  // apiBaseLink: 'http://localhost:4701',
  // ftpBaseLink: 'http://localhost:4701',

  apiBaseLink: 'https://api.healthynikah.com',
  ftpBaseLink: 'https://api.healthynikah.com',

  appBaseUrl: '/',
  userBaseUrl: 'home',
  deliverymanBaseUrl: 'dashboard',
  userProfileUrl: '/my-profile',
  userLoginUrl: '/authintication',
  deliverymanLoginUrl: '/',
  adminLoginUrl: 'login',
  adminBaseUrl: '/',
  storageSecret: 'SOFT_2021_IT_1998',
  adminTokenSecret: 'SOFT_ADMIN_1995_&&_SOJOL_dEv',
  userTokenSecret: 'SOFT_ADMIN_1996_&&_SOBUR_dEv',
  apiTokenSecret: 'SOFT_API_1998_&&_SAZIB_dEv',
  stripePublishableKey: 'pk_test_51LXis9EdSP1amkCQEkJLm7cT9vKbBClSDwBP1WFCOeMf4DDpkNjrl7GuhEi3EfAnLgpefYLRz7zZcdnUQ8aPjjuC00VfZ5OBsk',
  stripeSecretKey: 'sk_test_51LXis9EdSP1amkCQPqmmUdiVj9DjxwWUnzI4l0Ju3yQj3jrqCxkJbu0ZguAPSV0ACpSxGg45PzIecfbRKvmVDmTb00KqwU8Tsy',
  VERSION: 2,
  AndroidVersion: '1.2',
  facebookAppId: '2588976424598898',
  googleClientId:
    '413026093165-1a7mpu8qmairkh41688hasbb1eqi4lgs.apps.googleusercontent.com',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
