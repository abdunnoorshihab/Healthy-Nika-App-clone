import { Component, OnInit } from '@angular/core';
import {UserDataService} from "../../services/common/user-data.service";
import {ToastController} from "@ionic/angular";
import {PaymentSheetEventsEnum, Stripe} from '@capacitor-community/stripe';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {first, lastValueFrom, Subscription} from 'rxjs';
import {User} from "../../interfaces/common/user.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-credits',
  templateUrl: './credits.page.html',
  styleUrls: ['./credits.page.scss'],
})
export class CreditsPage implements OnInit {
  user?: User;
  isLoading?: boolean = false;
  selectedCredit: number = 0;

  private subDataOne: Subscription;
  constructor(
    private userDataService: UserDataService,
    private toastController: ToastController,
    private httpClient: HttpClient,
    private router: Router
  ) {
    Stripe.initialize({
      publishableKey: environment.stripePublishableKey,
    });
  }

  ngOnInit() {
    this.getLoggedUserData();
  }
  onSubmit(amount: number, credit: number) {
    this.isLoading = true;
    this.selectedCredit = credit;
    this.paymentSheet(amount, credit);
  }

  private async updateUserData(data: any) {

    this.userDataService.updateLoggedInUserInfo(data)
      .subscribe({
        next: res => {
          this.isLoading = false;
          if (res.success) {
            this.presentToast('top', 'Payment Success!', 'success');
            this.router.navigate(['/dashboard'])
          } else {
            this.presentToast('bottom', res.message, 'warning');
          }
        },
        error: err => {
          this.isLoading = false;
          this.presentToast('bottom', 'Something went wrong! Please try again later.', 'warning');
          console.log(err)
        }
      })
  }

  private getLoggedUserData() {
    this.subDataOne = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        this.user = res.data;
        // console.log('this.user',this.user)
        // this.setFormValue();
      },
      error: (err) => {
        if (err) {
          console.log(err);
        }
      }
    })
  }

  /**
   * Toast Message
   * presentToast()
   */
  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position,
      color,
    });
    await toast.present();
  }

  /**
   * Stripe Payment
   * paymentSheet()
   */
  async paymentSheet(amount: number, credit: number) {
    this.isLoading = true;
    try {
      // be able to get event of PaymentSheet
      Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
        console.log('PaymentSheetEventsEnum.Completed');
      });

      // Connect to your backend endpoint, and get every key.
      const body: any = {
        name: this.user? this.user?.name :'Md Tee',
        email: this.user? this.user?.email : 'contact.tee24@gmail.com',
        amount: amount,
        currency: 'gbp'
      }
      const response$ = this.httpClient.post<{
        paymentIntent: string;
        ephemeralKey: string;
        customer: string;
      }>(environment.apiBaseLink + '/api/payment/payment-sheet', body).pipe(first());

      const { paymentIntent, ephemeralKey, customer } = await lastValueFrom(response$);

      // console.log('paymentIntent', paymentIntent);

      // prepare PaymentSheet with CreatePaymentSheetOption.
      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        merchantDisplayName: 'HealthyNikah'
      });

      // console.log('createPaymentSheet...');

      // present PaymentSheet and get result.
      const result = await Stripe.presentPaymentSheet();
      if (result && result.paymentResult === PaymentSheetEventsEnum.Completed) {
        // Happy path
        this.updateUserData({credit: credit})

        console.log('Payment Success!')
      } else {
        // Unsuccessful Payment
        this.isLoading = false;
        this.presentToast('top', 'Payment Error! Please try again later.', 'danger');
      }

    } catch (e) {
      this.isLoading = false;
    }
  }

}
