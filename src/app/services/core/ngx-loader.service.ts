import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgxLoaderService {

  // USE FOR LOADER SHOW AND HIDE
  loader = false;

  constructor() { }

  /**
   * LOADER SHOW AND HIDE FUNCTIONS
   * onShowLoader()
   * onHideLoader()
  */
  onShowLoader() {
    this.loader = true;
  }

  onHideLoader() {
    this.loader = false;
  }

}
