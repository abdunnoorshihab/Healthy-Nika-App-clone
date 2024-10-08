import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import {UserService} from '../../services/common/user.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ReloadService} from "../../services/core/reload.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  // Store Data
  dataForm: FormGroup;
  isLoading: boolean = false;
  isShowPass = false;
  navigateFrom: string = null;
  remember = false;

  // Subscription
  private subRoute: Subscription;
  private subReloadData: Subscription;

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private reloadService: ReloadService,
    private location: Location,
  ) {}

  ngOnInit() {
    // Init Form
    this.initDataForm();

    // Activate Route
    this.subRoute = this.activatedRoute.queryParamMap.subscribe(qParam => {
      if (qParam.get('navigateFrom')) {
        this.navigateFrom = qParam.get('navigateFrom');
      }
    });

    // Retrieve loginInfo from localStorage when the component initializes
    const loginInfo: any = JSON.parse(localStorage.getItem('loginInfo') || '{}');

    // If loginInfo exists, patch the form with the values
    if (loginInfo && Object.keys(loginInfo).length) {
      this.dataForm.patchValue({
        username: loginInfo.username || null,
        password: loginInfo.password || null,
        remember: true
      });
    }

    // Subscribe to the reload service to update data when necessary
    this.subReloadData = this.reloadService.refreshData$.subscribe(() => {
      const refreshedLoginInfo = JSON.parse(localStorage.getItem('loginInfo') || '{}');
      if (refreshedLoginInfo) {
        this.dataForm.patchValue({
          username: refreshedLoginInfo.username || null,
          password: refreshedLoginInfo.password || null
        });
      }
    });
  }

  ionViewWillEnter() {
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.location.back();
  }

  /**
   * FORM METHODS
   * initDataForm()
   * onSubmit()
   */

  initDataForm() {
    this.dataForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [false]
    });
  }

  async onSubmit() {
    if (this.dataForm.get('remember').valid && this.dataForm.get('remember').value === true) {
      // Save login info only if "Remember Me" is checked
      localStorage.setItem('loginInfo', JSON.stringify(this.dataForm.value));
    } else {
      // Remove login info from localStorage if "Remember Me" is not checked
      localStorage.removeItem('loginInfo');
    }

    if (this.dataForm.invalid) {
      this.presentToast('bottom', 'Please enter all the required fields', 'danger').then();
      this.dataForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    try {
      this.navigateFrom = '/home';
      await this.userService.userLogin(this.dataForm.value, this.navigateFrom);
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
    }
  }

  /**
   * Ui Methods
   * onShowPassword()
   */
  onShowPassword() {
    this.isShowPass = !this.isShowPass;
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

  /**
   * Ion Page On Destroy
   */
  ionViewDidLeave() {
    // Unsubscribe from subscriptions
    if (this.subRoute) {
      this.subRoute.unsubscribe();
    }
    if (this.subReloadData) {
      this.subReloadData.unsubscribe();
    }

    // Clear the form if the user has not opted to remember the login
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo') || '{}');
    if (!loginInfo || !Object.keys(loginInfo).length) {
      this.dataForm.reset();
    }
  }

  ngOnDestroy() {
    if (this.subRoute) {
      this.subRoute.unsubscribe();
    }
    if (this.subReloadData) {
      this.subReloadData.unsubscribe();
    }
  }
}
