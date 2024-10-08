import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/common/user.service';

@Component({
  selector: 'app-authintication',
  templateUrl: './authintication.page.html',
  styleUrls: ['./authintication.page.scss'],
})
export class AuthinticationPage implements OnInit {
  isUser:boolean=false;

  constructor(
    private userService:UserService,
  ) { }

  ngOnInit() {
    if (this.userService?.getUserStatus()){
      this.isUser =true
    }
  }

}
