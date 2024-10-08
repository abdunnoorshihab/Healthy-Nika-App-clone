import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {NotificationService} from "../../services/common/notification.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  notificationCount: number = 0
  private subDataTwo: Subscription;

  constructor(
    private notificationService: NotificationService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.getUserNotificationCount();
  }

  goBack() {
    this.navCtrl.back();
  }

  private getUserNotificationCount() {
    this.subDataTwo = this.notificationService.getUserNotificationCount()
      .subscribe({
        next: res => {
          this.notificationCount = res.data.count;
        },
        error: err => {
          console.log(err)
        }
      })
  }
}
