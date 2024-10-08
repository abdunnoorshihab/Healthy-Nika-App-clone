import {Component, OnInit} from '@angular/core';
import {User} from "../../interfaces/common/user.interface";
import {ReloadService} from "../../services/core/reload.service";
import {ToastController} from "@ionic/angular";
import {UserDataService} from "../../services/common/user-data.service";
import {Subscription} from "rxjs";
import {Location} from "@angular/common";

@Component({
  selector: 'app-all-unhide-user',
  templateUrl: './all-unhide-user.page.html',
  styleUrls: ['./all-unhide-user.page.scss'],
})
export class AllUnhideUserPage implements OnInit {

  user: User;


  // Subscriptions
  private subDataOne: Subscription;
  private subReloadData: Subscription;

  constructor(
    private reloadService: ReloadService,
    private toastController: ToastController,
    private userDataService: UserDataService,
    private location: Location,
  ) {
  }

  ngOnInit() {
    // Reload Data & Get Data
    this.subReloadData = this.reloadService.refreshData$.subscribe(() => {
      this.getAllHidesUser();
    });
    this.getAllHidesUser();
  }

  ionViewDidEnter() {
    // Reload Data & Get Data
    this.subReloadData = this.reloadService.refreshData$.subscribe(() => {
      this.getAllHidesUser();
    });
    this.getAllHidesUser();
  }

  ionViewWillEnter() {
    this.goBack = this.goBack.bind(this);
  }


  goBack() {
    // this.navCtrl.back();
    this.location.back();
  }

  private getAllHidesUser() {

    this.subDataOne = this.userDataService.getAllHidesUser(null).subscribe({
      next: (res) => {
        this.user = res.data;

      },
      error: (err) => {
        console.log(err);

      },
    });
  }

  onNewUnhide(_id: string) {
    if (_id) {
      const fIndex = this.user?.hides?.findIndex(f => f._id === _id);
      this.user?.hides?.splice(fIndex, 1);
    }
  }

}
