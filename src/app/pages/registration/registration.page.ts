import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(
    private router:Router,
    private navCtrl: NavController,
  ) { }

  ngOnInit(
  ) {
  }

  goBack() {
    this.navCtrl.back();
  }

  /**
   * GET USER GENDER
   * onGetUserGender()
   */

  onGetUserGender(genderType:string){
    let formData = {
       gender:genderType,
    }
    if(genderType){
         window.sessionStorage.setItem('formData',JSON.stringify(formData));
         this.router.navigate(['/','registration1'])
    }

  }


}
