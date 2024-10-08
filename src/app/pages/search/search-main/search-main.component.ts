import {AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, EMPTY, pluck, Subscription, switchMap} from 'rxjs';

import {FilterData} from 'src/app/interfaces/core/filter-data';
import {Pagination} from 'src/app/interfaces/core/pagination';
import {ReloadService} from '../../../services/core/reload.service';
import {UserService} from "../../../services/common/user.service";
import {User} from "../../../interfaces/common/user.interface";
import {UserDataService} from "../../../services/common/user-data.service";
import {Request} from "../../../interfaces/common/request.interface";
import {RequestService} from "../../../services/common/request.service";

@Component({
  selector: 'app-search-main',
  templateUrl: './search-main.component.html',
  styleUrls: ['./search-main.component.scss'],
})
export class SearchMainComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;
  // SEARCH AREA
  searchUsers: User[] = [];
  user: any;
  users: User[] = [];
  requests: Request[] = [];
  requestsTo: Request[] = [];
  // SEARCH AREA
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  searchQuery = null;

  selectArray: any[] = [];

  // Subscriptions
  private subForm: Subscription;
  private subProduct: Subscription;
  private subDataOne: Subscription;
  private subReloadData: Subscription;
  private subDataTwo: Subscription;

  constructor(
    private router: Router,
    private userService: UserService,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private requestService: RequestService,
  ) { }

  ngOnInit() {
    this.subReloadData = this.reloadService.refreshData$.subscribe(() => {
      this.getRequestByUser();
      this.getRequestToByUser()
      this.searchQuery=null

    });
    this.selectArray = JSON.parse(localStorage.getItem('search_select')) ? JSON.parse(localStorage.getItem('search_select')) : [];
    this.getLoggedUserData();
    this.getRequestByUser()
    this.getRequestToByUser()
  }

  ionViewDidEnter() {
    // this.getRequestByUser()
  }


  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue
      .pipe(
        pluck('searchTerm'),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((data) => {
          this.searchQuery = data.trim();
          if (this.searchQuery === '' || this.searchQuery === null) {
            this.overlay = false;
            this.searchUsers = [];
            this.searchQuery = null;
            return EMPTY;
          }

          this.isLoading = true;
          const pagination: Pagination = {
            pageSize: 12,
            currentPage: 0,
          };
          // Select
          const mSelect = {
            name: 1,
            username: 1,
            phoneNo: 1,
            userId: 1,
            email: 1,
            parentEmail: 1,
            parentPhone: 1,
            dateOfBirth: 1,
            countryOfResidence: 1,
            cityzenShip: 1,
            professionalDetails: 1,
            otherProfession: 1,
            profession: 1,
            aboutMe: 1,
            islamicPractice: 1,
            educationLevel: 1,
            maritalStatus: 1,
            profileSummery: 1,
            lookinForProfession: 1,
            whatILooking: 1,
            additionalInfo: 1,
            cityOfResidence: 1,
            height: 1,
            ethnicity: 1,
            gender: 1,
            image: 1,
            age: 1,
            addresses: 1,
            profileImg: 1,
            createdAt: 1,
            pauseStatus: 1,
            unsuccess: 1,
            expired: 1,
            requests: 1,
            requestsReceived: 1,
            requestsSent: 1,
          };

          const filterData: FilterData = {
            pagination,
            filter: null,
            select: mSelect,
            sort: { name: 1 },
          };
          return this.userService.getAllUsersByAuth(
            filterData,
            this.searchQuery
          );
        })
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.searchUsers = res.data;
          // this.searchUsers = res.data.sort((a, b) => a.userId.toLowerCase().indexOf(this.searchQuery.toLowerCase()) - b.userId.toLowerCase().indexOf(this.searchQuery.toLowerCase()));
          if (this.searchUsers.length > 0) {
            this.isOpen = true;
            this.overlay = true;
          }
        },
        (error) => {
          this.isLoading = false;
          console.log(error);
        }
      );

  }

  ngAfterContentInit(): void {
    this.selectArray = JSON.parse(localStorage.getItem('search_select')) ? JSON.parse(localStorage.getItem('search_select')) : [];
  }

  private getLoggedUserData() {
    this.subDataOne = this.userDataService.getLoggedInUserData().subscribe({
      next: (res) => {
        this.user = res.data;
        // console.log('this.user', this.user)
      },
      error: (err) => {
        if (err) {
          console.log(err);
        }
      }
    })
  }


  private getRequestByUser() {
    this.subDataTwo = this.requestService.getRequestByUser()
      .subscribe(res => {
        this.requests = res.data;
        // console.log('this.requests',this.requests)
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

  /**
   * Remove Data From Array
   * onNewRequestSent()
   * onNewHide()
   */
  onNewRequestSent(_id: string) {
    if (_id) {
      const fIndex = this.searchUsers.findIndex(f => f._id === _id);
      this.searchUsers.splice(fIndex, 1);
    }
  }

  onNewHide(_id: string) {
    if (_id) {
      const fIndex = this.searchUsers.findIndex(f => f._id === _id);
      this.searchUsers.splice(fIndex, 1);
    }
  }

  // getRequest(data:string){
  //   return this.request?.find(f => f.requestTo?._id === data);
  // }
  /**
   * ON SEARCH CHANGE
   * onChangeInput()
   */
  onChangeInput(searchValue: HTMLInputElement) {
    const data = searchValue.value ? searchValue.value.trim() : null;
    this.selectArray = JSON.parse(localStorage.getItem('search_select')) ? JSON.parse(localStorage.getItem('search_select')) : [];
    const findIndex = this.selectArray.findIndex((m) => m.name === data);
    if (findIndex === -1) {
      this.selectArray.push({ name: data });
      localStorage.setItem('search_select', JSON.stringify(this.selectArray));
    }

    if (data) {
      this.router.navigate(['/success-match'], {
        queryParams: { searchQuery: data },
        queryParamsHandling: 'merge',
      });
    } else {
      // this.router.navigate(['/product-list'], {
      //   queryParams: { searchQuery: null },
      //   queryParamsHandling: 'merge',
      // });
    }

    searchValue.value = '';
    this.searchUsers = [];
  }



  public onSubmit() {

  }

  /**
   * HANDLE SEARCH Area
   * onClickHeader()
   * onClickSearchArea()
   * handleOverlay()
   * handleFocus()
   * setPanelState()
   * handleOpen()
   * handleOutsideClick()
   * handleCloseOnly()
   * handleCloseAndClear()
   * onSelectItem()
   */
  onClickHeader(): void {
    this.searchInput.nativeElement.value = '';
    this.handleCloseOnly();
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }

  handleOverlay(): void {
    this.overlay = false;
    this.isOpen = false;
    this.isFocused = false;
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchUsers.length > 0) {
      this.setPanelState(event);
    }
    this.isFocused = true;
  }

  private setPanelState(event: FocusEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = false;
    this.handleOpen();
  }

  handleOpen(): void {
    if (this.isOpen || (this.isOpen && !this.isLoading)) {
      return;
    }
    if (this.searchUsers.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  handleOutsideClick(): void {
    this.searchInput.nativeElement.value = '';
    if (!this.isOpen) {
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseOnly(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseAndClear(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.searchUsers = [];
    this.isFocused = false;
  }

  onSelectItem(data: any): void {
    this.searchInput.nativeElement.value = '';
    this.handleCloseAndClear();
    this.selectArray = JSON.parse(localStorage.getItem('search_select')) ? JSON.parse(localStorage.getItem('search_select')) : [];
    const findIndex = this.selectArray.findIndex((m) => m.name === data?.name);
    if (findIndex === -1) {
      this.selectArray.push({ name: data?.name });
      localStorage.setItem('search_select', JSON.stringify(this.selectArray));
    }

    this.router.navigate(['/product-details', data?.slug]);
  }

  onDeleteLocalData() {
    localStorage.removeItem('search_select');
    this.selectArray = [];
  }


  onSelectArray(dataValue: string, searchValue: HTMLInputElement) {
    searchValue.value = dataValue.toLocaleLowerCase();
    this.searchQuery = dataValue.toLocaleLowerCase();

    this.isLoading = true;
    const pagination: Pagination = {
      pageSize: 12,
      currentPage: 0,
    };
    // Select
    const mSelect = {
      name: 1,
      userId: 1,
      gender: 1,
      age: 1,
      profileImg: 1,
      status: 1,
    };


    const filterData: FilterData = {
      pagination,
      filter: { status: 'publish' },
      select: mSelect,
      sort: { createdAt: -1 },
    };

    this.subProduct = this.userService.getAllUsers(filterData, this.searchQuery).subscribe(
      (res) => {
        this.isLoading = false;
        this.searchUsers = res.data;
        if (this.searchUsers.length > 0) {
          this.isOpen = true;
          this.overlay = true;
        }
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );

  }

  /**
   * NG ON DESTROY
   */

  ngOnDestroy(): void {
    if (this.subForm) {
      this.subForm.unsubscribe();
    }
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
    if (this.subReloadData) {
      this.subReloadData.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
  }

}
