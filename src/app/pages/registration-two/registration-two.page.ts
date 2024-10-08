import {CommonModule} from '@angular/common';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {IonicModule, NavController, ToastController} from '@ionic/angular';
import {IonicSelectableComponent} from 'ionic-selectable';
import {COUNTRY_DB, Ethnicity_DB, NATIONALITY} from 'src/app/core/db/country.db';
import {SearchableSelectModule} from 'src/app/shared/components/searchable-select/searchable-select.module';
import {HEIGHT_TYPE} from '../../core/utils/app-data';
import {Select} from '../../interfaces/core/select';
import COUNTRY_DATA from "../../core/utils/country";
import {MaterialModule} from "../../material/material.module";
import {UtilsService} from "../../services/core/utils.service";
import {PipesModule} from "../../shared/pipes/pipes.module";
import {NationalitySearchModule} from "../../shared/components/nationality-search/nationality-search.module";
import {debounceTime, Subject} from "rxjs";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: 'app-registration-two',
  standalone: true,
  imports: [
    IonicSelectableComponent,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule,
    SearchableSelectModule,
    MaterialModule,
    PipesModule,
    NationalitySearchModule,
  ],

  templateUrl: './registration-two.page.html',
  styleUrls: ['./registration-two.page.scss'],
})
export class RegistrationTwoPage implements OnInit {
  minDate: string;
  maxDate: string;
  searchQuery: string = '';
  dataForm: FormGroup;
  prevData: any;
  heightType: Select[] = HEIGHT_TYPE;
  countrys = COUNTRY_DB;
  nationality = NATIONALITY;
  cities: any;
  ethincity = Ethnicity_DB;
  countrySelected = null;
  citySelected = null;
  ethincitySelected = null;
  secEthincitySelected = null;
  nationalitySelected = null;
  countryData: any[] = COUNTRY_DATA;
  getSingleCountry?: any;
  private nationalityChangeSubject = new Subject<any>();
  // getSingleNationality?: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    public utilsService: UtilsService,
    private navCtrl: NavController,
    private cdRef: ChangeDetectorRef
  ) {
    const today = new Date();
    this.minDate = new Date(today.setFullYear(today.getFullYear() - 100)).toISOString().split('T')[0];
    this.maxDate = new Date(today.setFullYear(today.getFullYear() + 82) - 1).toISOString().split('T')[0];
  }

  ngOnInit() {
    /** GET PREVIOUS DATA FROM LOCALSTORAGE */
    this.onInitForm();
    this.prevData = JSON.parse(`${sessionStorage.getItem('formData')}`);
    this.onGetSingleCountry(this.countryData[0]);
    this.setFormValue();
    this.nationalityChangeSubject.pipe(debounceTime(300)).subscribe(event => {
      this.onNationalityChange(event);
    });
  }

  private setFormValue() {
    if(this.prevData){
      this.dataForm.patchValue(this.prevData);
    }
    // this.getSingleCountry = this.prevData?.countryCode1;
    if(this.prevData?.countryCode1){
      this.getSingleCountry = this.countryData.find(
        (data) => data?.dial_code?.toLowerCase() ===   this.prevData?.countryCode1?.toLowerCase()
      );
    }
    if(this.prevData?.ethnicity){
      this.ethincitySelected = this.prevData?.ethnicity;
    }
    if(this.prevData?.cityzenShip){
      this.nationalitySelected = this.prevData?.cityzenShip;
    }
    if(this.prevData?.secondEthnicity){
      this.secEthincitySelected = this.prevData?.secondEthnicity;
    }
    if(this.prevData?.countryOfResidence){
      this.countrySelected = this.prevData?.countryOfResidence;
    }
    if(this.prevData?.cityOfResidence){
      this.citySelected = this.prevData?.cityOfResidence;
    }
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
    this.dataForm.get('countryCode1').setValue(this.getSingleCountry?.dial_code);
  }

  // onGetSingleNationality(countryObj: any) {
  //   this.getSingleNationality = this.countryData.find(
  //     (data) => data?.name?.toLowerCase() === countryObj?.name?.toLowerCase()
  //   );
  //   this.dataForm.get('cityzenShip').setValue(this.getSingleNationality?.name);
  // }

  /**
   * FORM INITIALIZE
   * onInitForm()
   * onSubmit()
   */

  onInitForm() {
    this.dataForm = this.fb.group({
      parentEmail: [null],
      multiEthnic: ['no'],
      countryCode1: [null],
      cityzenShip: [null,Validators.required],
      dateOfBirth: [null,Validators.required],
      // phoneNo: [null, Validators.required],
      parentPhone: [
        null,
        this.prevData?.gender === 'female' ? Validators.required : '',
      ],
      countryOfResidence: [null, Validators.required],
      cityOfResidence: [null, Validators.required],
      height: [null, Validators.required],
      ethnicity: [null, Validators.required],
      secondEthnicity: [null],
    });
  }

  onSubmit() {
    let registrationArea = document.getElementById('registrationArea');
    // console.log('this.dataForm.value', this.dataForm.value);
    if (this.dataForm.valid) {
      let prevData = this.prevData;
      let newData = { ...this.dataForm.value, ...prevData };
      sessionStorage.setItem('formData', JSON.stringify(newData));
      this.router.navigate(['/', 'registration3']).then();
    } else {
      this.dataForm.markAllAsTouched();
      this.presentToast('bottom', 'Required field incomplete', 'danger').then();
      registrationArea.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'start',
      });
    }
  }

  onNationalityChange(event: any) {
   if(event){
     this.dataForm.patchValue({
       cityzenShip: event.name
     });
   }
  }


  onCountryChange(event: any) {
    // Reset the city selection completely
    this.citySelected = null;
    this.cities = [];

    // Reset the form control for cityOfResidence
    const cityControl = this.dataForm.get('cityOfResidence');
    if (cityControl) {
      cityControl.reset();  // This clears the value
      cityControl.markAsPristine();  // Mark it as pristine
      cityControl.markAsUntouched();  // Mark it as untouched
    }

    // Set countryOfResidence with the selected country name
    this.dataForm.patchValue({
      countryOfResidence: event?.name || null,
    });

    // Find the selected country's cities and update the cities array
    const selectedCountry = this.countrys?.find(
      (item) => item?.name === event?.name
    );

    if (selectedCountry) {
      this.cities = [...selectedCountry.city]; // Populate the cities array
    }
  }

  onCityChange(event: any) {
    // Update the cityOfResidence form control
    this.dataForm.patchValue({
      cityOfResidence: event || null
    });
  }



  onEthnicityChange(event: any) {
    this.dataForm.patchValue({
      ethnicity: event.name,
    });
  }

  onEthnicityChangeSecond(event: any) {
    this.dataForm.patchValue({
      secondEthnicity: event.name,
    });
  }


  onDateChange(event: any) {
    this.dataForm.patchValue({ dateOfBirth: this.utilsService.getDateString(event.detail.value) });
  }

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


  // get filteredData() {
  //   return this.nationality
  //     .filter(data =>
  //       data.name.toLowerCase().includes(this.searchQuery.toLowerCase())
  //     )
  //     .sort((a, b) => {
  //       const query = this.searchQuery.toLowerCase();
  //       const aName = a.name.toLowerCase();
  //       const bName = b.name.toLowerCase();
  //       // Prioritize items that start with the search query
  //       if (aName.startsWith(query) && !bName.startsWith(query)) {
  //         return -1;
  //       }
  //       if (!aName.startsWith(query) && bName.startsWith(query)) {
  //         return 1;
  //       }
  //       // Further sort alphabetically
  //       return aName.localeCompare(bName);
  //     });
  // }

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
