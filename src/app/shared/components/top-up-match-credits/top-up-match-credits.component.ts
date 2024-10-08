import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-top-up-match-credits',
  templateUrl: './top-up-match-credits.component.html',
  styleUrls: ['./top-up-match-credits.component.scss'],
})
export class TopUpMatchCreditsComponent  implements OnInit {

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
