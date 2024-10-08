import { Component, OnInit } from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import { UserService } from '../../services/common/user.service';
import { HttpClient } from '@angular/common/http';
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { environment } from '../../../environments/environment';
import { first, lastValueFrom, Subscription } from 'rxjs';
import { FileUploadService } from '../../services/gallery/file-upload.service';
import { FileData } from '../../interfaces/gallery/file-data';
import { UtilsService } from '../../services/core/utils.service';
import { DiscountTypeEnum } from "../../enum/product.enum";
import { Coupon } from "../../interfaces/common/coupon.interface";
import { CouponService } from "../../services/common/coupon.service";
import { UserDataService } from 'src/app/services/common/user-data.service';

@Component({
  selector: 'app-registration-five',
  templateUrl: './registration-five.page.html',
  styleUrls: ['./registration-five.page.scss'],
})
export class RegistrationFivePage implements OnInit {

  isLoader: boolean = false;
  selectAmount: number = 10;
  couponCode: string;
  couponDiscount: number = 0
  coupon: Coupon = null;
  private subDataSix: Subscription;

  constructor(
    private toastController: ToastController,
    private httpClient: HttpClient,
    private userService: UserService,
    private userDataService: UserDataService,
    private fileUploadService: FileUploadService,
    private utilsService: UtilsService,
    private couponService: CouponService,
    private navCtrl: NavController,
  ) {
    Stripe.initialize({
      publishableKey: environment.stripePublishableKey,
    });
  }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }

  /**
   * On SSubmit
   */

  async onSubmit() {

    this.isLoader = true;
    const finalData: any = JSON.parse(sessionStorage.getItem('formData'));

    const mData = {
      ...finalData,
      ...{
        registrationType: 'email',
        hasAccess: true,
        credit: 0,
        discount: this.discount,
        couponCode: this.couponCode ? this.couponCode : null,
      }
    }

    if (this.selectAmount === 10) {
      mData.credit = 0;
      mData.amount = this.grandTotal;
    } else if (this.selectAmount === 22) {
      mData.credit = 3;
      mData.amount = this.grandTotal;
    } else if (this.selectAmount === 40) {
      mData.credit = 10;
      mData.amount = this.grandTotal;
    } else {
      mData.credit = 0;
      mData.amount = this.grandTotal;
    }

    // console.log('mData', mData);

    // Check User Existence
    this.checkUserForRegistration(mData);

  }

  /**
   * Stripe Payment
   * paymentSheet()
   */
  async paymentSheet(amount: number, registrationData: any) {
    try {
      // be able to get event of PaymentSheet
      Stripe.addListener(PaymentSheetEventsEnum.Completed, async () => {
        console.log('PaymentSheetEventsEnum.Completed');
      });

      // Connect to your backend endpoint, and get every key.
      const body: any = {
        name: registrationData.name,
        email: registrationData.email,
        amount: amount,
        currency: 'gbp'
      }
      const response$ = this.httpClient.post<{
        paymentIntent: string;
        ephemeralKey: string;
        customer: string;
      }>(environment.apiBaseLink + '/api/payment/payment-sheet', body).pipe(first());

      const { paymentIntent, ephemeralKey, customer } = await lastValueFrom(response$);



      // prepare PaymentSheet with CreatePaymentSheetOption.
      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        merchantDisplayName: 'HealthyNikah'
      });


      // present PaymentSheet and get result.
      const result = await Stripe.presentPaymentSheet();
      if (result && result.paymentResult === PaymentSheetEventsEnum.Completed) {
        // After Complete Payment
        await this.userRegistration(registrationData);
      } else {
        this.isLoader = false;
        this.presentToast('top', 'Payment Error! Please try again later.', 'danger').then();
      }

    } catch (e) {
      this.isLoader = false;
      // Error History
      const mData = {
        collection: 'Payment by UI',
        apiName: "Payment Error!",
        errorMessage: e.message ? e.message.toString() : e.toString(),
      }
      this.userDataService.errorCheckAndStore(mData)
    }
  }

  /**
   * HTTP REQ HANDLE
   * checkUserForRegistration()
   */

  private checkUserForRegistration(data: any) {
    this.userService.checkUserForRegistration(data.email).subscribe({
      next: res => {
        if (res.data.hasUser) {
          this.isLoader = false;
          this.presentToast('bottom', 'Sorry! Email is already exists', 'danger').then();
        } else {
          this.paymentSheet(this.grandTotal, data)
          // this.userRegistration(data);
        }
      },
      error: err => {
        this.isLoader = false;
        console.log(err)
      }
    })
  }

  private async userRegistration(registrationData: any) {
    const regPickImageData = this.fileUploadService.regPickImageData;
    if (regPickImageData && regPickImageData.length) {
      this.imageUploadOnServer(regPickImageData, registrationData);
    } else {

      try {
        await this.userService.userSignupAndLogin(
          registrationData
        );
        this.isLoader = false;
      } catch (e) {
        // Error History
        let eMsg = e.message ? e.message.toString() : e.toString()
        const mData = {
          collection: 'User Registration Error by UI',
          apiName: "User Registration Error!",
          errorMessage: eMsg + 'REG_DATA____: ' + registrationData.toString(),
        }
        this.userDataService.errorCheckAndStore(mData)
      }

    }
  }

  private imageUploadOnServer(data: FileData[], registrationData?: any) {
    const mFiles = data.map(m => this.utilsService.blobToFile(m?.file, m?.fileName))
    this.fileUploadService.uploadMultiImageOriginal(mFiles)
      .subscribe({
        next: async (res) => {
          const urls = res.map(m => m.url);

          const finalData = {
            ...registrationData,
            ...{
              profileImg: urls
            }
          }
          try {
            await this.userService.userSignupAndLogin(
              finalData
            );
            this.isLoader = false;
          } catch (err) {
            this.isLoader = false;


            let eMsg = err.message ? err.message.toString() : err.toString()
            // Error History
            const mData = {
              collection: 'Image with Registration Error',
              apiName: "Image Reg Err!",
              errorMessage: eMsg + 'REG_DATA____: ' + finalData.toString(),
            }
            this.userDataService.errorCheckAndStore(mData)
          }


        },
        error: async (err) => {
          this.isLoader = false;
          this.presentToast('bottom', 'Image Not Upload! Please upload from profile.', 'warning').then();

          await this.userService.userSignupAndLogin(
            registrationData
          );

          // Error History
          const mData = {
            collection: 'Image Upload Error by UI',
            apiName: "Image Error!",
            errorMessage: err.message ? err.message.toString() : err
          }
          this.userDataService.errorCheckAndStore(mData)
        }
      });
  }

  /**
   * Calculation
   * grandTotal()
   * discount()
   */

  get grandTotal() {
    return this.selectAmount - this.discount;
  }

  get discount() {
    return this.couponDiscount;
  }


  private calculateCouponDiscount() {
    if (this.coupon.discountType === DiscountTypeEnum.PERCENTAGE) {
      this.couponDiscount = Math.floor((this.coupon.discountAmount / 100) * this.selectAmount)
    } else {
      this.couponDiscount = Math.floor(this.coupon.discountAmount)
    }
  }


  /**
   * Toast Message
   * presentToast()
   */
  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color: 'danger' | 'warning' | 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position,
      color: color,
    });

    await toast.present();
  }

  onRemoveCoupon() {
    this.couponDiscount = 0;
    this.couponCode = null;
    this.coupon = null;
  }

  onApplyCoupon() {
    if (!this.couponCode && !this.couponCode?.trim()) {
      this.presentToast('bottom', 'Please enter your coupon code.', 'danger').then();
      return;
    }

    this.subDataSix = this.couponService.checkCouponAvailability(
      { couponCode: this.couponCode, subTotal: this.selectAmount })
      .subscribe({
        next: (res) => {
        if (res.success) {
          this.presentToast('bottom', res.message, 'success').then();
          this.coupon = res.data;
          if (this.coupon) {
            this.calculateCouponDiscount();
          }
        } else {
          this.presentToast('bottom', res.message, 'danger').then();
        }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
