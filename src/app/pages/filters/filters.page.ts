import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UserDataService} from "../../services/common/user-data.service";
import {Subscription} from "rxjs";
import {DataService} from "../../services/common/dataService";
import {UtilsService} from '../../services/core/utils.service';
import {FilterData} from '../../interfaces/core/filter-data';
import {DATABASE_KEY} from '../../core/utils/global-variable';
import {UserService} from '../../services/common/user.service';

type UserFilterType = 'age' | 'ethnicity' | 'profession';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],

})
export class FiltersPage implements OnInit, OnDestroy {
  storedFilter: any;
  filter: any;
  filterData: any;
  ageOptions: any[] = [];
  ethnicityOptions: any[] = [];
  professionOptions: any[] = [];

  selectedAges: string[] = [];
  selectedEthnicities: string[] = [];
  selectedProfessions: string[] = [];

  displayedAgeOptions = [];
  displayedEthnicityOptions = [];
  displayedProfessionOptions = [];
  private itemsToShow = 4;
  totalUsers: number = 0;
  isFilterApplied: boolean = false;

  isLoading = true;


  //Subscription
  private subGroupData: Subscription;
  private subDataGetAll: Subscription;

  constructor(
    private userDataService: UserDataService,
    private userService: UserService,
    private modalController: ModalController,
    private dataService: DataService,
    private utilsService: UtilsService,
  ) {

  }

  ngOnInit() {
    this.getUserFilterGroup();
  }


  private getUserFilterGroup() {
    this.subGroupData = this.userDataService.getUserFilterGroup().subscribe(
      (res) => {
        if (res.success) {
          this.filterData = res.data;
          const transformedData = this.dataService.transformData(this.filterData);
          // Assign the transformed options to component properties
          this.ageOptions = transformedData.ageOptions;
          this.ethnicityOptions = transformedData.ethnicityOptions;
          this.professionOptions = transformedData.professionOptions;
          this.updateDisplayedOptions('age');
          this.updateDisplayedOptions('ethnicity');
          this.updateDisplayedOptions('profession');
          this.isLoading = false;
        }
      },
      (err) => {
        if (err) {
          this.isLoading = false;
          console.log(err);
        }
      }
    )
  }

  /**
   * UI Logic
   * toggleFilterItem()
   * toggleFilterItemSelectAll()
   * updateFilterDataArr()
   * filterBySelection()
   *
   */

  toggleFilterItem(type: UserFilterType, value: string) {
    if (type === 'age') {
      this.updateFilterDataArr(type, this.selectedAges, value);
    } else if (type === 'ethnicity') {
      this.updateFilterDataArr(type, this.selectedEthnicities, value);
    } else if (type === 'profession') {
      this.updateFilterDataArr(type, this.selectedProfessions, value);
    }
  }

  toggleFilterItemSelectAll(type: UserFilterType, actionType: 'select' | 'clear') {

    if (actionType === 'select') {

      if (type === 'age') {
        this.selectedAges = [...this.ageOptions];
        // Filter
        this.filterBySelection(type, this.selectedAges);
      } else if (type === 'ethnicity') {
        this.selectedEthnicities = [...this.ethnicityOptions];
        // Filter
        this.filterBySelection(type, this.selectedEthnicities);
      } else if (type === 'profession') {
        this.selectedProfessions = [...this.professionOptions];
        // Filter
        this.filterBySelection(type, this.selectedProfessions);
      }
    } else if (actionType === 'clear') {
      if (type === 'age') {
        this.selectedAges = [];
        // Filter
        this.filterBySelection(type, this.selectedAges);
      } else if (type === 'ethnicity') {
        this.selectedEthnicities = [];
        // Filter
        this.filterBySelection(type, this.selectedEthnicities);
      } else if (type === 'profession') {
        this.selectedProfessions = [];
        // Filter
        this.filterBySelection(type, this.selectedProfessions);
      }
    }


  }


  private updateFilterDataArr(type: UserFilterType, dataArr: string[], value: string) {
    const index = dataArr.indexOf(value);
    if (index === -1) {
      dataArr.push(value);
    } else {
      dataArr.splice(index, 1);
    }
    // Filter
    this.filterBySelection(type, dataArr);

  }

  private filterBySelection(type: UserFilterType, dataArr: string[]) {
    switch (type) {
      case 'age': {
        const ageFilterArr = [];
        dataArr.forEach(f => {
          const g = f.split('-');
          ageFilterArr.push({
            dateOfBirth: {
              $gte: this.utilsService.addYearInDate(Number(g[1])),
              $lte: this.utilsService.addYearInDate(Number(g[0])),
            }
          })
        })
        this.filter = {...this.filter, ...{age: ageFilterArr}};
        break;
      }
      case 'ethnicity': {
        this.filter = {...this.filter, ...{ethnicity: {$in: dataArr}}};
        break;
      }
      case 'profession': {
        this.filter = {...this.filter, ...{profession: {$in: dataArr}}};
        break;
      }
      default: {
        break;
      }
    }


    if (this.filter) {
      let mFilter = {
        $and: []
      };
      if (this.filter.age && this.filter.age.length) {
        mFilter.$and.push({
          $or: this.filter.age
        })
      } else {
        mFilter.$and.splice(0, 1);
      }

      if (this.filter.ethnicity && this.filter.ethnicity.$in && this.filter.ethnicity.$in.length) {
        mFilter.$and.push({ethnicity: this.filter.ethnicity});
      } else {
        mFilter.$and.splice(1, 1);
      }

      if (this.filter.profession && this.filter.profession.$in && this.filter.profession.$in.length) {
        mFilter.$and.push({profession: this.filter.profession});
      } else {
        mFilter.$and.splice(2, 1);
      }

      if (mFilter.$and.length) {
        this.isFilterApplied = true;
        this.storedFilter = mFilter;
        // console.log('mFilter', mFilter)
        this.getAllUsers(mFilter);
      } else {
        this.storedFilter = null;
        this.isFilterApplied = false;
        this.totalUsers = 0;
      }
    } else {
      this.isFilterApplied = false;
    }
  }


  /**
   * Other Item View Logic
   * toggleShowMore()
   * updateDisplayedOptions()
   */
  toggleShowMore(type: UserFilterType) {
    this.itemsToShow += 4;
    this.updateDisplayedOptions(type);
  }

  updateDisplayedOptions(type: UserFilterType) {
    if (type === 'age') {
      this.displayedAgeOptions = this.ageOptions.slice(0, this.itemsToShow);
    } else if (type === 'ethnicity') {
      this.displayedEthnicityOptions = this.ethnicityOptions.slice(0, this.itemsToShow);
    } else if (type === 'profession') {
      this.displayedProfessionOptions = this.professionOptions.slice(0, this.itemsToShow);
    }
  }


  /**
   * Modal Logic
   * closeModal()
   */
  closeModal() {
    if (this.totalUsers > 0) {
      this.modalController.dismiss(this.storedFilter)
    } else {
      this.modalController.dismiss()
    }

  }


  /**
   * HTTP REQ
   * getAllUsers()
   */
  private getAllUsers(filter: any) {
    const filterData: FilterData = {
      filter: filter,
      pagination: null,
      select: {
        name: 1,
      },
      sort: {createdAt: -1}
    }
    this.subDataGetAll = this.userService.getAllUsersByAuth(filterData, null)
      .subscribe({
        next: res => {
          this.totalUsers = res.count;
        },
        error: err => {
          console.log(err)
        }
      })
  }

  ngOnDestroy() {
    if (this.subGroupData) {
      this.subGroupData.unsubscribe();
    }

    if (this.subDataGetAll) {
      this.subDataGetAll.unsubscribe();
    }
  }
}
