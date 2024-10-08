import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Coupon} from '../../interfaces/common/coupon.interface';
import { FilterData } from 'src/app/interfaces/gallery/filter-data';
const API_TAG = environment.apiBaseLink + '/api/coupon/';


@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * checkCouponAvailability
   */

  checkCouponAvailability(data: {couponCode: string, subTotal: number}) {
    return this.httpClient.post<ResponsePayload>
    (API_TAG + 'check-coupon-availability', data);
  }


}
