import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {Subscription} from "rxjs";
import {NotificationService} from "../../services/common/notification.service";
import {NavController} from "@ionic/angular";
@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        opacity: '0',
        padding:'0',
        margin:'0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})

export class FaqPage implements OnInit {
  notificationCount: number = 0

  private subDataTwo: Subscription;
  constructor(
    private navCtrl: NavController,
    private notificationService: NotificationService,
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

  toggle(index: number): void {
    this.faqData[index].isExpanded = !this.faqData[index].isExpanded;
  }

  faqData =[
    {
      title:'What is a match credit?',
      description:'Match credits are required to request another profile.\n' +
        'Credits are used only if the match is successful and\n' +
        'both parties agree to exchange information. If the\n' +
        'request is unsuccessful the credits will be returned to\n' +
        'your account.',
      isExpanded: false,
    },
    {
      title:'What happens if I don’t receive a response?',
      description:'Members are frequently reminded to respond to\n' +
        'match requests. If there\'s no response within 7 days,\n' +
        'the request expires and the match credit is reinstated.',
      isExpanded: false,
    },
    {
      title:'What information is exchanged following a\n' +
        'successful match?',
      description:'Name, phone number, email and parent’s number',
      isExpanded: false,
    },
    {
      title:'Is the data kept safe and secure?',
      description:'Personal details like names and phone numbers are\n' +
        'private until both parties accept a match. We use\n' +
        'strong security measures and encryption to ensure\n' +
        'your information is safe.',
      isExpanded: false,
    },
    {
      title:'How many profiles can I request at any time?',
      description:'You can request as many profiles as you have match\n' +
        'credits available.',
      isExpanded: false,
    },
    {
      title:'Why do I give my parents’ contact details?',
      description:'This is for safeguarding and to ensure our members\n' +
        'are serious about marriage, with the knowledge of\n' +
        'their parents.',
      isExpanded: false,
    },
    {
      title:'When will my profile be uploaded on social media?',
      description:'You can review your profile code in account settings.\n' +
        'We usually post in order of application so this can be\n' +
        'used as a guide to see when you’d be uploaded.',
      isExpanded: false,
    },
    {
      title:'Why is there a one-time view policy for pictures?',
      description:'Our one-time view policy is for the safety and comfort\n' +
        'of our candidates whilst ensuring a fair evaluation of\n' +
        'compatibility.',
      isExpanded: false,
    },
    {
      title:'I have made a successful match and want to view\n' +
        'the picture again, what can I do?',
      description:'You will need to contact your match directly as the\n' +
        'one-time view has expired.',
      isExpanded: false,
    },
  ]

}
