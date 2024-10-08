import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-request-match-pop-up',
  templateUrl: './request-match-pop-up.component.html',
  styleUrls: ['./request-match-pop-up.component.scss'],
})
export class RequestMatchPopUpComponent  implements OnInit {

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
