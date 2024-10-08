import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NavController, ToastController} from '@ionic/angular';
import {Professions} from "../../core/utils/app-data";

@Component({
  selector: 'app-registration-three',
  templateUrl: './registration-three.page.html',
  styleUrls: ['./registration-three.page.scss'],
})
export class RegistrationThreePage implements OnInit {
  practiceCharCount: number = 0;
  aboutCharCount: number = 0;
  spouseCharCount: number = 0;
  dataForm: FormGroup;
  professionSelected = null;
  professions = Professions;
  prevData: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private navCtrl: NavController,
  ) {}

  ngOnInit() {
    this.onInitForm();
    this.prevData = JSON.parse(`${sessionStorage.getItem('formData')}`);
    this.setFormValue();
  }

  goBack() {
    let prevData = JSON.parse(`${sessionStorage.getItem('formData')}`);
    let newData = { ...this.dataForm.value, ...prevData };
    sessionStorage.setItem('formData', JSON.stringify(newData));
    this.navCtrl.back();
  }

  private setFormValue() {
    if (this.prevData) {
      this.dataForm.patchValue(this.prevData);
    }
    if(this.prevData?.profession){
      this.professionSelected = this.prevData?.profession;
    }
  }

  /**
   * FORM INITIALIZE
   * onInitForm()
   * onSubmit()
   */

  onInitForm() {
    this.dataForm = this.fb.group({
      maritalStatus: [null],
      educationLevel: [null, Validators.required],
      hijab: [null, this.prevData?.gender === 'female' ? Validators.required : ''],
      profession: [null],
      partnerProfession: [null],
      otherPartnerProfession: [null],
      findingMatch: ['one', Validators.required],
      otherProfession: [null, this.professionSelected === 'Other' ? Validators.required : ''],
      additionalInformation: [null],
      termsConditions: [null, Validators.required],
      islamicPractice: [
        null,
        [Validators.required, Validators.maxLength(1000)],
      ],
      selfSummery: [null, [Validators.required, Validators.maxLength(1000)]],
      aboutMe: [
        null,
        [
          Validators.required,
          Validators.maxLength(1000),
        ],
      ],
      professionalDetails: [null, Validators.required],
    });
  }

  onChangeProfession(event: any) {
    console.log('event',event);
    this.dataForm.patchValue({
      profession: event.name,
    });
  }

  onIslamicPracticeInput(event: Event): void {
    const inputValue = (event.target as HTMLTextAreaElement).value;
    this.practiceCharCount = inputValue.length;
  }
  onAboutPracticeInput(event: Event): void {
    const inputValue = (event.target as HTMLTextAreaElement).value;
    this.aboutCharCount = inputValue.length;
  }
  onSpousePracticeInput(event: Event): void {
    const inputValue = (event.target as HTMLTextAreaElement).value;
    this.spouseCharCount = inputValue.length;
  }

  onCountryChange(event: any) {
    // this.dataForm.patchValue({
    //   professionSelect: event.name,
    // });

    // this.dataForm.patchValue({
    //   partnerProfession: event.job_title,
    // });
    // this.profession = this.professions?.find(
    //   (item) => item?.name === event?.name
    // ).city;
  }

  onSubmit() {
    if(!this.dataForm.value.termsConditions){
      this.presentToast('bottom', 'Please Select Terms and Conditions', 'danger');
      return;
    }
    console.log(this.dataForm.value);
    let registrationArea = document.getElementById('registrationArea');
    if (this.dataForm.valid) {
      let prevData = JSON.parse(`${sessionStorage.getItem('formData')}`);
      let newData = { ...this.dataForm.value, ...prevData };
      sessionStorage.setItem('formData', JSON.stringify(newData));
      this.router.navigate(['/', 'registration4']);
    } else {
      this.dataForm.markAllAsTouched();
      this.presentToast('bottom', 'Required field incomplete', 'danger');
      registrationArea.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'start',
      });
    }
  }

  openTerms(event:any) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('termsPopup').style.display = 'block';
  }

  closeTerms() {
    document.getElementById('termsPopup').style.display = 'none';
  }

  /**
   * Toast Message
   * presentToast()
   */
  async presentToast(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    color: 'danger' | 'warning' | 'success'
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position,
      color: color,
    });

    await toast.present();
  }
}
