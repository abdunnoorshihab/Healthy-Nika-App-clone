import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {DashboardService} from "../../services/common/dashboard.service";
import {UserDashboard} from "../../interfaces/common/dashboard.interface";
import {UserService} from "../../services/common/user.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  // Subscriptions
  private subDataOne: Subscription;
  userDashboard: UserDashboard = null;
  userId:any;
  constructor(
    private dashboardService: DashboardService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.getUserDashboard();
    this.userId = this.userService.getUserId();
  }


  /**
   * HTTP REQ HANDLE
   * getUserDashboard()
   */
  getUserDashboard() {
    this.subDataOne = this.dashboardService.getUserDashboard()
      .subscribe({
        next: (res) => {
          this.userDashboard = res.data;
          // console.log("this.userDashboard", this.userDashboard);

        },
        error: (err) => {
          console.log(err)
        }
      })
  }

  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

}
