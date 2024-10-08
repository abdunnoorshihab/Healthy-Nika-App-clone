import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {User} from '../../interfaces/common/user.interface';
import {FilterData} from 'src/app/interfaces/core/filter-data';
import {Subject} from 'rxjs';


const API_USER = environment.apiBaseLink + '/api/user/';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  userDataPass = new Subject<any>();

  constructor(
    private httpClient: HttpClient
  ) {
  }


  /**
   * GET USER DATA WITH SUBJECT
   * getUserData()
   * passUserData()
   */

  get getUserData(){
     return this.userDataPass;
  }

  passUserData(data:User){
      this.userDataPass.next(data);
  }



  /**
   * addUser
   * insertManyUser
   * getAllUsers
   * getUserById
   * updateUserById
   * updateMultipleUserById
   * deleteUserById
   * deleteMultipleUserById
   */

userSignup(data: User) {
    return this.httpClient.post<ResponsePayload>
    (API_USER + 'signup', data);
  }

  insertManyUser(data: User, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_USER + 'insert-many', mData);
  }

  getAllUsers(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: User[], count: number, success: boolean }>(API_USER + 'get-all', filterData, {params});
  }
  /**
   * getShopInformation
   */

  getUserFilterGroup(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: any, message: string, success: boolean }>(API_USER + 'get-filter-group', { params });
  }


  getAllHidesUser( select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: any, message: string, success: boolean }>(API_USER +'get-all-hides-by-user', {});
  }

  getUserById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: User, message: string, success: boolean }>(API_USER + id, {params});
  }


  getUserByUserId(userId: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: User, message: string, success: boolean }>(API_USER + 'get-by-user/' + userId, {params});
  }


  updateUserById(id: string, data: User) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_USER + 'update-data/' + id, data);
  }

  updateMultipleUserById(ids: string[], data: User) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_USER + 'update-multiple-data-by-id', mData);
  }

  deleteUserById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_USER + 'delete-data/' + id, {params});
  }

  deleteMultipleUserById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_USER + 'delete-multiple-data-by-id', {ids: ids}, {params});
  }

  getLoggedInUserData(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: User }>(API_USER + 'logged-in-user-data', {params});
  }

  updateLoggedInUserInfo(data: any) {
    return this.httpClient.put<ResponsePayload>(API_USER + 'update-logged-in-user', data);
  }


  updateHideId(data: any) {
    return this.httpClient.put<ResponsePayload>(API_USER + 'update-hide-profile-in-user', data);
  }
  updateUnhideId(data: any) {
    return this.httpClient.put<ResponsePayload>(API_USER + 'update-unhide-profile-in-user', data);
  }

  changeLoggedInUserPassword(data: { password: string, oldPassword: string }) {
    return this.httpClient.put<ResponsePayload>(API_USER + 'change-logged-in-user-password', data);
  }

  /**
   * User Address Api
   * getAllAddress()
   * deleteAddress()
   * addAddress()
   */



  checkUserAndSentOtp(data: { phoneNo: string, username: string }) {
    return this.httpClient.post<ResponsePayload>(API_USER + 'check-user-and-sent-otp', data);
  }


  checkUserCredit() {
    return this.httpClient.get<{ data: {credit: number}, success: boolean, message?: string }>(API_USER + 'check-user-credit');
  }

  errorCheckAndStore(data: any) {
    return this.httpClient.post<ResponsePayload>
    (API_USER + 'error-check-and-store', data).subscribe();
  }






}
