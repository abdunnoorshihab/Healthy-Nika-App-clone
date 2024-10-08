import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanonicalService {

  constructor(
    @Inject(DOCUMENT) private dom
  ) {
  }

  /**
   * CONICAL SERVICE
   * setCanonicalURL() 
  */
  setCanonicalURL(url?: string) {
    const canURL = 'https:' + (url === undefined ? this.dom.URL : url);
    const link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', canURL);
  }


}
