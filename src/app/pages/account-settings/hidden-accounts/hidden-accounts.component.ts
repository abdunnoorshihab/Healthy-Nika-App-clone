import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../interfaces/common/user.interface";

@Component({
  selector: 'app-hidden-accounts',
  templateUrl: './hidden-accounts.component.html',
  styleUrls: ['./hidden-accounts.component.scss'],
})
export class HiddenAccountsComponent  implements OnInit {
  @Input() userData: User;

  constructor() { }

  ngOnInit() {}

}
