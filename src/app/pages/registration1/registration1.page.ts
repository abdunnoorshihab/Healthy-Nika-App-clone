import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NavController, ToastController} from '@ionic/angular';
import COUNTRY_DATA from "../../core/utils/country";

@Component({
  selector: 'app-registration1',
  templateUrl: './registration1.page.html',
  styleUrls: ['./registration1.page.scss'],
})
export class Registration1Page implements OnInit {
  isPassword = false;
  isRepeatPassword = false;
  dataForm: FormGroup;
  searchQuery: string = '';
  countryData: any[] = COUNTRY_DATA;
  getSingleCountry?: any;
  prevData: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.onInitForm();
    this.prevData = JSON.parse(`${sessionStorage.getItem('formData')}`);
    this.setFormValue();
    this.onGetSingleCountry(this.countryData[0]);
  }
  private setFormValue() {
    this.dataForm.patchValue(this.prevData);
    this.getSingleCountry = this.prevData?.countryCode;
  }
  goBack() {
    let prev = this.prevData;
    let newData = { ...this.dataForm.value, ...prev };
    sessionStorage.setItem('formData', JSON.stringify(newData));
    this.navCtrl.back();
  }

  onGetSingleCountry(countryObj: any) {
    this.getSingleCountry = this.countryData.find(
      (data) => data?.name?.toLowerCase() === countryObj?.name?.toLowerCase()
    );

    this.dataForm.get('countryCode').setValue(this.getSingleCountry?.dial_code);

  }

  // get filteredCountryData() {
  //   return this.countryData.filter(data =>
  //     data.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
  //     data.dial_code.toLowerCase().includes(this.searchQuery.toLowerCase())
  //   );
  // }
  get filteredCountryData() {
    return this.countryData
      .filter(data =>
        data.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        data.dial_code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        data.dial_code1.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const query = this.searchQuery.toLowerCase();
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        // Prioritize items that start with the search query
        if (aName.startsWith(query) && !bName.startsWith(query)) {
          return -1;
        }
        if (!aName.startsWith(query) && bName.startsWith(query)) {
          return 1;
        }
        // Further sort alphabetically
        return aName.localeCompare(bName);
      });
  }
  /**
   * PASSWORD SHOW FUNCTIONALITY
   * onShowPassword()
   * onShowRepeatPassword()
   */

  onShowPassword() {
    this.isPassword = !this.isPassword;
  }

  onShowRepeatPassword() {
    this.isRepeatPassword = !this.isRepeatPassword;
  }

  /**
   * FORM INITIALIZE
   * onInitForm()
   * onSubmit()
   */

  onInitForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      countryCode: [null],
      // username: [null, Validators.required],
      password: [null, Validators.required],
      repeatPassword: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phoneNo: [null, Validators.required],

    })
  }

  onSubmit() {
    let registrationArea = document.getElementById('registrationArea');
    if (this.dataForm.value.password !== this.dataForm.value.repeatPassword) {
      this.presentToast('bottom', 'Password and confirm password is not matched', 'danger');
      this.dataForm.get('password').markAsTouched({ onlySelf: true });
      this.dataForm.get('repeatPassword').markAsTouched({ onlySelf: true });
      this.dataForm.setErrors({ 'passwordMismatch': true });
      return;
    }

    if (this.dataForm.valid) {

      let prevData = JSON.parse(`${sessionStorage.getItem('formData')}`);
      let newData = { ...this.dataForm.value, ...prevData };
      sessionStorage.setItem('formData', JSON.stringify(newData));
      this.router.navigate(['/', 'registration2']);
    } else {
      this.dataForm.markAllAsTouched();
      this.presentToast('bottom', 'Required field incomplete', 'danger');
      registrationArea.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' })
    }
  }



  /**
   * Toast Message
   * presentToast()
   */
  async presentToast(position: 'top' | 'middle' | 'bottom', message, color) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position,
      color,
    });
    await toast.present();
  }

}
