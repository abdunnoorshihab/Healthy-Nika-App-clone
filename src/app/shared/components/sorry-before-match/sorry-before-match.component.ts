import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-sorry-before-match',
  templateUrl: './sorry-before-match.component.html',
  styleUrls: ['./sorry-before-match.component.scss'],
})
export class SorryBeforeMatchComponent  implements OnInit {

  constructor(
    private modalController:ModalController,

  ) { }

  ngOnInit() {}

  onClose() {
    return   this.modalController.dismiss(false,'No');
  }
}

