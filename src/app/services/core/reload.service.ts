import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {

  // REFRESH DATA, CART, WISHLIST AND PRESCRIPTION
  private refreshData = new Subject<void>();
  private refreshCart = new BehaviorSubject<boolean>(false);
  private refreshWishList = new BehaviorSubject<boolean>(false);
  private refreshRequest = new BehaviorSubject<boolean>(false);
  private refreshNotification = new BehaviorSubject<boolean>(false);
  private refreshPrescription = new BehaviorSubject<boolean>(false);
  private refreshSearch = new BehaviorSubject<boolean>(false);
  private refresPlay = new Subject<boolean>();
  private headerShopData = new Subject();
  private selectedAddress = new Subject();
  private refreshCartSlide = new Subject();
  private refreshSideNav = new Subject();
  private refreshSelectedData = new Subject();
  constructor() { }

  /**
   * REFRESH GLOBAL DATA FUNCTIONS
   * refreshData$()
   * needRefreshData$()
  */
  get refreshData$() {
    return this.refreshData;
  }

  needRefreshData$() {
    this.refreshData.next();
  }

  /**
   * REFRESH Select DATA
   */
  get refreshSelectData$() {
    return this.refreshSelectedData;
  }

  needRefreshSelectData$(data: any) {
    this.refreshSelectedData.next(data);
  }

  /**
   * REFRESH CART FUNCTIONS
   * refreshCart$()
   * needRefreshCart$()
  */
  get refreshCart$() {
    return this.refreshCart;
  }

  needRefreshCart$(data?: boolean) {
    if (data && data === true) {
      this.refreshCart.next(data);
    } else {
      this.refreshCart.next(false);
    }
  }

  /**
   * REFRESH WISH-LIST FUNCTIONS
   * refreshWishList$()
   * needRefreshWishList$()
  */
  get refreshWishList$() {
    return this.refreshWishList;
  }

  needRefreshWishList$(data?: boolean) {
    if (data && data === true) {
      this.refreshWishList.next(data);
    } else {
      this.refreshWishList.next(false);
    }
  }

  get refreshRequest$() {
    return this.refreshRequest;
  }

  needRefreshRequest$(data?: boolean) {
    if (data && data === true) {
      this.refreshRequest.next(data);
    } else {
      this.refreshRequest.next(false);
    }
  }

  get refreshNotification$() {
    return this.refreshNotification;
  }

  needRefreshNotification$(data?: boolean) {
    if (data && data === true) {
      this.refreshNotification.next(data);
    } else {
      this.refreshNotification.next(false);
    }
  }
  /**
   * REFRESH PRESCRIPTION FUNCTIONS
   * refreshPrescription$()
   * needRefreshPrescription$()
  */
  get refreshPrescription$() {
    return this.refreshWishList;
  }

  needRefreshPrescription$(data?: boolean) {
    if (data && data === true) {
      this.refreshPrescription.next(data);
    } else {
      this.refreshPrescription.next(false);
    }
  }

  /**
* Search
*/
  get refreshSearch$() {
    return this.refreshSearch;
  }

  needRefreshSearch$(data?: boolean) {
    if (data && data === true) {
      this.refreshSearch.next(data);
    } else {
      this.refreshSearch.next(false);
    }
  }

  /**
* Pass Header Data
*/
  get getHeaderData() {
    return this.headerShopData;
  }
  passHeaderData(data: any) {
    this.headerShopData.next(data);
  }

  /**
* SELECT ADDRESS Data
*/
  get geSelectedAddressData() {
    return this.selectedAddress;
  }
  passingSelectedAddressData(data: any) {
    this.selectedAddress.next(data);
  }
  /**
   * REFRES AUTO PLAY GALLERY SLIDE
   */

  get refreshAutoplay$() {
    return this.refresPlay;
  }

  needRefreshAutoPlay$(a: any) {
    this.refresPlay.next(a);
  }

  /**
 * REFRES AUTO PLAY GALLERY SLIDE
 */

  get refreshCartSlide$() {
    return this.refreshCartSlide;
  }

  needRefreshCartSlide$(a: any) {
    this.refreshCartSlide.next(a);
  }


  /**
* REFRES AUTO PLAY GALLERY SLIDE
*/

  get refreshMenuSlide$() {
    return this.refreshSideNav;
  }

  needRefreshMenuSlide$(a: any) {
    this.refreshSideNav.next(a);
  }


}
