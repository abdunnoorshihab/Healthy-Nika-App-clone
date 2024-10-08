import {Component, OnInit} from '@angular/core';
import {ModalController, Platform} from '@ionic/angular';
import {Capacitor} from '@capacitor/core';
import {Location} from '@angular/common';
import {AppVersionService} from './services/core/app-version.service';
import {environment} from '../environments/environment';
import {AppUpdateComponent} from './shared/dialog-view/app-update/app-update.component';
import {FcmService} from './services/core/fcm.service';
import {UserService} from './services/common/user.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private location: Location,
    private appVersionService: AppVersionService,
    private modalController: ModalController,
    private fcmService: FcmService,
    private userService: UserService,
  ) {
    if (Capacitor.getPlatform() !== 'web') {
      this.initializeApp();
    }
    this.userService.autoUserLoggedIn();
  }

  ngOnInit() {
    // Base Data
    // this.getAppVersion();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // StatusBar.setStyle({style: Style.Light});
      // StatusBar.setBackgroundColor({color: ' #c3075f'});
      // Fcm Ref -> https://youtu.be/pVsOIXjKbas
      /**
       * Complex Task Ref 0r Doc
       * Fcm Ref -> https://youtu.be/pVsOIXjKbas
       * Splash Screen: androidManifest.xml > logo.xml (must be group) > styles.xml
       * Status bar: styles.xml > color.xml
       */
      this.fcmService.initPush();
    }).catch(e => {
      console.log('error fcm: ', e);
    });

    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.location.isCurrentPathEqualTo('/') || this.location.isCurrentPathEqualTo('/home')) {
        navigator['app'].exitApp();
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   * getAppVersion()
   */
  private getAppVersion() {
    this.appVersionService.getAppVersion()
      .subscribe({
        next: res => {
          if (res.success && res.data) {
            const dbVersion = Number(res.data.deliveryAndroid);
            const localVersion = Number(environment.AndroidVersion)
            if (localVersion < dbVersion) {
              this.openComponentModal(res.data.forceDeliveryAndroid)
            }
          }
        },
        error: err => {
          console.log(err)
        }
      })
  }

  /**
   * MODAL VIEW
   * openComponentModal()
   */

  async openComponentModal(force: boolean) {
    const modal = await this.modalController.create({
      component: AppUpdateComponent,
      backdropDismiss: true,
      canDismiss: force,
      cssClass: 'app-update-modal'
    });
    await modal.present();
  }
}
