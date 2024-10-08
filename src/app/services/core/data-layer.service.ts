import { Injectable } from '@angular/core';
import {WindowRefService} from './window-ref.service';

// https://itbusinesshub.com/blog/integrate-google-tag-manager-in-angular-app/

@Injectable({
  providedIn: 'root'
})
export class DataLayerService {
  private window;

  constructor (private _windowRef: WindowRefService)
  {
    this.window = _windowRef.nativeWindow; // intialise the window to what we get from our window service

  }

  private pingHome(obj)
  {
    if(obj)  this.window.dataLayer.push(obj);
  }


  //list of all our dataLayer methods

  logPageView(url)
  {
    const hit = {
      event: 'content-view',
      pageName: url
    };
    this.pingHome(hit);
  }

  logEvent(event,category,action,label)
  {
    const hit = {
      event:event,
      category:category,
      action:action,
      label: label
    }
    this.pingHome(hit);
  }

  eventTrack(data: any) {
    this.window.dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
    this.pingHome(data);
  }

  logCustomDimensionTest(value)
  {
    const hit = {
      event:'custom-dimension',
      value:value
    }
    this.pingHome(hit);
  }



  // .. add more custom methods as needed by your app.
}
