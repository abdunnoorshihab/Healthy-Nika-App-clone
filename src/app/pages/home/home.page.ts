import {Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild} from '@angular/core';
import {CarouselControlService} from 'src/app/services/core/carousel-control.service';
import {FilterData} from "../../interfaces/core/filter-data";
import {UserService} from "../../services/common/user.service";
import {Subscription} from "rxjs";
import {User} from "../../interfaces/common/user.interface";
import {RequestService} from "../../services/common/request.service";
import {ReloadService} from "../../services/core/reload.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IonContent, ModalController, ToastController} from "@ionic/angular";
import {UserDataService} from 'src/app/services/common/user-data.service';
import {NotificationService} from "../../services/common/notification.service";
import {PreferencesService} from '../../services/core/preferences.service';
import {FiltersPage} from "../filters/filters.page";
import {FCM_TOKEN, FCM_TOKEN_UPDATED, USER_CARD_DATA_SELECT} from '../../core/utils/app-data';
import {Request} from "../../interfaces/common/request.interface";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonContent, {static: false}) content: IonContent;

  isRandomSort: boolean = true;
  // Shore Data
  showArrow = true;
  private intervalId: any;
  users: User[] = [];
  notificationCount: number = 0
  isLoading: boolean = true;
  filterModal: any;
  isFilteringData: boolean = false;
  requests: Request[] = [];
  requestsTo: Request[] = [];
  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subReloadData: Subscription;

  constructor(
    private carousel: CarouselControlService,
    private usersService: UserService,
    private requestService: RequestService,
    private notificationService: NotificationService,
    private reloadService: ReloadService,
    private toastController: ToastController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userDataService: UserDataService,
    private preferencesService: PreferencesService,
    private modalController: ModalController,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private el: ElementRef
  ) {

  }

  ngOnInit() {
    this.subReloadData = this.reloadService.refreshData$.subscribe(() => {
      this.getRequestByUser();
      this.getRequestToByUser()
      this.getAllUsersByAuth();
    });
    this.activatedRoute.queryParamMap.subscribe(qParam => {
      if (qParam.get('filterView')) {
        this.openFilterModal();
      } else {
        if (this.filterModal) {
          this.filterModal.dismiss()
        }
      }
    });

    // Base Data
    this.updateLoggedInDeliverymanInfo();
  }

  ionViewDidEnter() {
    this.intervalId = setInterval(() => {
      this.getUserNotificationCount();
    }, 2000);
    //  Base Data
    this.getAllUsersByAuth();
    this.getUserNotificationCount();
    this.getRequestByUser()
    this.getRequestToByUser()
    // Scroll
    this.scrollIndicator();

  }

  scrollToTop() {
    this.content.scrollToTop(500); // Smooth scroll to the top
  }
  // private scrollIndicator() {
  //   this.content.getScrollElement().then(scrollElement => {
  //     scrollElement.addEventListener('scroll', () => {
  //       this.ngZone.run(() => {
  //         this.checkScrollPosition(scrollElement);
  //       });
  //     });
  //     // Initial check in case the content is already fully scrolled
  //     this.checkScrollPosition(scrollElement);
  //   });
  // }
  //
  //
  // checkScrollPosition(scrollElement: HTMLElement) {
  //   const scrollHeight = scrollElement.scrollHeight;
  //   const offsetHeight = scrollElement.offsetHeight;
  //   const scrollTop = scrollElement.scrollTop;
  //
  //   // Calculate whether to show the arrow based on scroll position
  //   if (scrollHeight - scrollTop - offsetHeight <= 1) {
  //     this.showArrow = false;
  //   } else {
  //     this.showArrow = true;
  //   }
  // }

  // private scrollIndicator() {
  //   this.content.getScrollElement().then(scrollElement => {
  //     // Ensure scroll events are captured and processed within Angular's zone
  //     scrollElement.addEventListener('scroll', () => {
  //       this.ngZone.run(() => {
  //         this.checkScrollPosition(scrollElement);
  //       });
  //     });
  //
  //     // Initial check in case the content is already partially scrolled
  //     this.checkScrollPosition(scrollElement);
  //   });
  // }
  //
  // private checkScrollPosition(scrollElement: HTMLElement) {
  //   const scrollHeight = scrollElement.scrollHeight;
  //   const offsetHeight = scrollElement.offsetHeight;
  //   const scrollTop = scrollElement.scrollTop;
  //
  //   // Show the arrow if scrolled down by more than a small threshold
  //   // Hide the arrow when at or near the end of the content
  //   this.showArrow = scrollTop > 10 && scrollHeight - scrollTop - offsetHeight > 1;
  // }

  private scrollIndicator() {
    this.content.getScrollElement().then(scrollElement => {
      // Ensure scroll events are captured and processed within Angular's zone
      scrollElement.addEventListener('scroll', () => {
        this.ngZone.run(() => {
          this.checkScrollPosition(scrollElement);
        });
      });

      // Initial check in case the content is already partially scrolled
      this.checkScrollPosition(scrollElement);
    });
  }

  private checkScrollPosition(scrollElement: HTMLElement) {
    // const scrollHeight = scrollElement.scrollHeight;
    // const offsetHeight = scrollElement.offsetHeight;
    const scrollTop = scrollElement.scrollTop;

    // Show the arrow if scrolled down by more than a small threshold
    // Hide the arrow when at or near the end of the content
    this.showArrow = scrollTop <= 10;
    // this.showArrow = scrollTop <= 10 || (scrollHeight - scrollTop - offsetHeight > 1);
  }


  /**
   * HTTP REQ HANDLE
   * getAllUsersByAuth()
   * getAllUsersByFilter()
   * deleteMultipleUsersById()
   */

  private getAllUsersByAuth(filter?: any) {
    const filterData: FilterData = {
      // filter: filter ? filter : {pauseStatus: 'Active'},
      filter: filter,
      pagination: null,
      select: USER_CARD_DATA_SELECT,
      sort: this.isRandomSort ? { random: true } : { createdAt: -1 },
    };
    this.subDataOne = this.usersService.getAllUsersByAuth(filterData, null).subscribe({
      next: (res) => {
        this.users = res.data;
        // console.log("this.users", this.users)
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  private getUserNotificationCount() {
    this.subDataTwo = this.notificationService.getUserNotificationCount()
      .subscribe({
        next: res => {
          this.notificationCount = res.data.count;
          // console.log('this.notificationCount' , this.notificationCount)
        },
        error: err => {
          console.log(err)
        }
      })
  }

  private getRequestByUser() {
    this.subDataTwo = this.requestService.getRequestByUser()
      .subscribe(res => {
        this.requests = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getRequestToByUser() {
    this.subDataTwo = this.requestService.getRequestToByUser()
      .subscribe(res => {
        this.requestsTo = res.data;
        // console.log('this.requestToMatchData',this.requestToMatchData)
      }, error => {
        console.log(error);
      });
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.getAllUsersByAuth();
      event.target.complete();
    }, 2000);
  }


  /**
   * Modal View
   * navigateToFilterModal()
   * openFilterModal()
   */
  navigateToFilterModal() {
    this.router.navigate([], {queryParams: {filterView: 'open'}}).then();
  }

  async openFilterModal() {
    this.filterModal = await this.modalController.create({
      component: FiltersPage,
    });
    this.filterModal.onDidDismiss().then((modalData) => {

      if (modalData && modalData.data) {
        this.isFilteringData = true;
        this.getAllUsersByAuth(modalData.data);
      } else {
        this.isFilteringData = false;
        // console.log('Nothing')
      }
      this.router.navigate([], {queryParams: {filterView: null}}).then();
    });
    await this.filterModal.present();
  }


  /**
   * Remove Data From Array
   * onNewRequestSent()
   * onNewHide()
   */
  onNewRequestSent(_id: string) {
    if (_id) {
      const fIndex = this.users.findIndex(f => f._id === _id);
      this.users.splice(fIndex, 1);
    }
  }

  onNewHide(_id: string) {
    if (_id) {
      const fIndex = this.users.findIndex(f => f._id === _id);
      this.users.splice(fIndex, 1);
    }
  }

  onClearFilter() {
    this.isFilteringData = false;
    this.getAllUsersByAuth();
  }

  /**
   * Notification Control
   */
  private async updateLoggedInDeliverymanInfo() {
    const saved_token = JSON.parse((await this.preferencesService.getStorage(FCM_TOKEN)).value);
    const isFcmUpdated = JSON.parse((await this.preferencesService.getStorage(FCM_TOKEN_UPDATED)).value);

    if (saved_token && !isFcmUpdated) {
      const data = {fcmToken: saved_token}
      this.userDataService.updateLoggedInUserInfo(data).subscribe({
        next: res => {
          this.preferencesService.setStorage(FCM_TOKEN_UPDATED, JSON.stringify(true));
        }
        ,
        error: error => {
          console.log(error);
        }
      });
    }


  }

}
