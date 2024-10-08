import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Request} from '../../interfaces/common/request.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable, shareReplay} from "rxjs";
import {UserDashboard} from "../../interfaces/common/dashboard.interface";

const API_BRAND = environment.apiBaseLink + '/api/request/';


@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addRequest
   * insertManyRequest
   * getAllRequests
   * getRequestById
   * updateRequestById
   * updateMultipleRequestById
   * deleteRequestById
   * deleteMultipleRequestById
   */

  addRequest(data: Request):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add-to-request', data);
  }

  // getUserDashboard() {
  //   return this.httpClient.get<{ data: UserDashboard, message: string, success: boolean }>(API_DASHBOARD + 'user-dashboard');
  // }

  // getRequestByUser() {
  //   return this.httpClient.get<{ data: Request[], count: number, success: boolean }>(API_BRAND + 'get-all-requests-by-user').pipe(shareReplay());
  // }

  getRequestByUser() {
    return this.httpClient.get<{ data: Request[], count: number, success: boolean }>(API_BRAND + 'get-requests-by-user');
  }
  getRequestToByUser() {
    return this.httpClient.get<{ data: Request[], count: number, success: boolean }>(API_BRAND + 'get-request-to-by-user');
  }

  getRequestToUser() {
    return this.httpClient.get<{ data: Request[], count: number, success: boolean }>(API_BRAND + 'get-requests-to-user');
  }

  getAllRequests(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Request[], count: number, success: boolean }>(API_BRAND + 'get-all/', filterData, {params});
  }

  getRequestById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Request, message: string, success: boolean }>(API_BRAND +'get-all-requests-by-user/'+ id, {params});
  }

  updateRequestById(id: string, data: any) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  deleteRequestById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }
  deleteRequestByUserById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete-request/' + id, {params});
  }

  deleteMultipleRequestById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'delete-multiple', {ids: ids}, {params});
  }

  // requestGroupByField<T>(dataArray: T[], field: string): RequestGroup[] {
  //   const data = dataArray.reduce((group, product) => {
  //     const uniqueField = product[field]
  //     group[uniqueField] = group[uniqueField] ?? [];
  //     group[uniqueField].push(product);
  //     return group;
  //   }, {});
  //
  //   const final = [];
  //
  //   for (const key in data) {
  //     final.push({
  //       _id: key,
  //       data: data[key]
  //     })
  //   }
  //
  //   return final as RequestGroup[];

  // }



}
