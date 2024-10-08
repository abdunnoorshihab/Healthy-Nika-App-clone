import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
})
export class SearchableSelectComponent implements OnInit {
  @ViewChild('search') searchBox: ElementRef;
  @Input() items?: any[] = [];
  @Input() fieldTitle?: string;
  @Input() itemTextField: string;
  @Output() onChange = new EventEmitter();
  @Input() selectedValue?: any;
  @Input() holdItems?: any[] = [];
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

  onSelectValue(data: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.selectedValue !== data) {
      this.selectedValue = data;
      this.onChange.emit(data);
      this.isActive = false;
      this.searchBox.nativeElement.value = '';
      this.items = this.holdItems;
    }else if (data === null) {
      this.selectedValue = null;  // Reset selectedValue
      this.onChange.emit(null);  // Emit null when resetting
      this.searchBox.nativeElement.value = '';
      this.items = this.holdItems;  // Reset the items list
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
      this.items = this.holdItems;
    } else {
      this.searchValue = this.filterData(this.holdItems, searchQuery);
      this.items = this.searchValue;
      this.isClear = true;
    }
  }

  clearInput() {
    this.searchBox.nativeElement.value = '';
    this.isClear = false;
    this.items = this.holdItems;
    this.selectedValue = null;
    this.onChange.emit(null);
  }

}
