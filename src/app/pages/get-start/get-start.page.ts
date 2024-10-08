import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-get-start',
  templateUrl: './get-start.page.html',
  styleUrls: ['./get-start.page.scss'],
})
export class GetStartPage implements OnInit {

  constructor(
    private router:Router
  ) { }

  ngOnInit() {
    setTimeout(() => {
      // Any calls to load data go here
      this.router.navigate(['/authintication'])
    }, 2000);
  }

}
