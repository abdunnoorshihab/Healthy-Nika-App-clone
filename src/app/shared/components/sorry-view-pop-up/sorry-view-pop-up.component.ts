import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-sorry-view-pop-up',
  templateUrl: './sorry-view-pop-up.component.html',
  styleUrls: ['./sorry-view-pop-up.component.scss'],
})
export class SorryViewPopUpComponent  implements OnInit {

  constructor(
    private modalController:ModalController,

  ) { }

  ngOnInit() {}

  onClose() {
    return   this.modalController.dismiss(false,'No');
  }
}
