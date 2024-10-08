import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-nationality-search',
  templateUrl: './nationality-search.component.html',
  styleUrls: ['./nationality-search.component.scss'],
})
export class NationalitySearchComponent  implements OnInit {
  @ViewChild('search') searchBox: ElementRef;
  @Input() items1?: any[] = [];
  @Input() fieldTitle?: string;
  @Input() itemTextField: string;
  @Input() selectedValue?: any;
  @Input() holdItems1?: any[] = [];
  @Output() onChange1 = new EventEmitter();
  isActive = false;
  searchValue: any[] = [];
  isClear = false;

  constructor() { }

  ngOnInit() {

  }

  /**
   * ALL FUNCTIONALITY
   * onSelectValue()
   * onShowPopup()
   * filterData()
   * onSearch()
   */

  onSelectValue(data: any) {
    if (this.selectedValue !== data) {
      this.onChange1.emit(data);
      this.selectedValue = data;
      this.isActive = false;
      this.searchBox.nativeElement.value = '';
      this.items1 = this.holdItems1;
    }
  }

  onShowPopup() {
    this.isActive = !this.isActive;
  }

  filterData(items: any[], searchQuery: string) {
    return items.filter((d: any) => {
      return this.itemTextField ? d[this.itemTextField].toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 : d.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
    });
  }

  onSearch(searchQuery: string) {
    if (searchQuery === '' || searchQuery === null) {
      this.searchValue = [];
      this.items1 = this.holdItems1;
    } else {
      this.searchValue = this.filterData(this.holdItems1, searchQuery);
      this.items1 = this.searchValue;
      this.isClear = true;
    }
  }

  clearInput() {
    this.searchBox.nativeElement.value = '';
    this.isClear = false;
    this.items1 = this.holdItems1;
  }

}
