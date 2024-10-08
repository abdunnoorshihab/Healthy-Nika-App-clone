import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-check-status',
  templateUrl: './check-status.component.html',
  styleUrls: ['./check-status.component.scss'],
})
export class CheckStatusComponent  implements OnInit {

  constructor(
    private modalController:ModalController,
    private router:Router,
  ) { }

  ngOnInit() {}

  onSubmit() {
    this.router.navigate(['/account-settings']);
    return   this.modalController.dismiss(false);
  }

  onClose() {
    return   this.modalController.dismiss(false,'No');
  }


}
