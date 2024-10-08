import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-view-pop-up',
  templateUrl: './view-pop-up.component.html',
  styleUrls: ['./view-pop-up.component.scss'],
})
export class ViewPopUpComponent  implements OnInit {

  constructor(
    private modalController:ModalController,
  ) { }

  ngOnInit() {}

  onSubmit() {
    return   this.modalController.dismiss(true,'Yes');
  }

  onClose() {
    return   this.modalController.dismiss(false,'No');
  }

}
