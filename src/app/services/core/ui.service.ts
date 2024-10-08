// import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { SnackbarNotificationComponent } from '../../shared/components/ui/snackbar-notification/snackbar-notification.component';
//
//
// @Injectable({
//   providedIn: 'root'
// })
// export class UiService {
//
//   constructor(
//     public snackBar: MatSnackBar,
//   ) { }
//
//   /**
//    * SNACKBAR FUNCTIONS
//    * success()
//    * warn()
//    * wrong()
//   */
//   success(msg) {
//     this.snackBar.openFromComponent(SnackbarNotificationComponent, {
//       data: msg,
//       duration: 1300,
//       horizontalPosition: 'center',
//       verticalPosition: 'bottom',
//       panelClass: ['notification', 'success-snackbar']
//     });
//   }
//
//   warn(msg) {
//     this.snackBar.openFromComponent(SnackbarNotificationComponent, {
//       data: msg,
//       duration: 1300,
//       horizontalPosition: 'center',
//       verticalPosition: 'bottom',
//       panelClass: ['notification', 'warn-snackbar']
//     });
//   }
//
//   wrong(msg) {
//     this.snackBar.openFromComponent(SnackbarNotificationComponent, {
//       data: msg,
//       duration: 1300,
//       horizontalPosition: 'center',
//       verticalPosition: 'bottom',
//       panelClass: ['notification', 'wrong-snackbar']
//     });
//   }
//
// }
