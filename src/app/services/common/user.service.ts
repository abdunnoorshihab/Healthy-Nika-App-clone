import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DATABASE_KEY } from '../../core/utils/global-variable';
import { User, UserAuthResponse } from '../../interfaces/common/user.interface';
import { ReloadService } from '../core/reload.service';
import { StorageService } from '../core/storage.service';


import { ToastController } from '@ionic/angular';

import { UtilsService } from '../core/utils.service';
import { FilterData } from "../../interfaces/core/filter-data";
import { UserDataService } from './user-data.service';

const API_URL_USER = environment.apiBaseLink + '/api/user/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private token: string;
  private isUser = false;
  private userId: string = null;
  private gender: string = null;
  userStatusListener = new Subject<boolean>();
  // Hold The Count Time..
  private tokenTimer: any;

  constructor(
    private httpClient: HttpClient,
    private router: Router,

    private storageService: StorageService,
    private reloadService: ReloadService,
    private toastController: ToastController,
    private userDataService: UserDataService,
    private utilsService: UtilsService
  ) {
  }

  /**
   * MAIN METHODS
   * checkUserForRegistration()
   * userSignupAndLogin()
   * userLogin()
   */

  checkUserForRegistration(username: string) {
    return this.httpClient.post<{
      data: { hasUser: boolean };
      message: string;
      success: boolean;
    }>(API_URL_USER + 'check-user-for-registration', { username });
  }

  resetUserPassword(data: string) {
    return this.httpClient.put<{ message: string; success: boolean }>(
      API_URL_USER + 'reset-user-password',
      data
    );
  }

  getAllUsers(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: User[], count: number, success: boolean }>(API_URL_USER + 'get-all-by-user', filterData, { params });
  }

  getAllUsersByAuth(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: User[], count: number, success: boolean }>(API_URL_USER + 'get-all-by-user-by-auth', filterData, { params });
  }


  userSignupAndLogin(data: any, navigateFrom?: string) {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post<UserAuthResponse>(API_URL_USER + 'signup-and-login', data)
        .subscribe(
          async (res) => {
            if (res.success) {
              this.token = res.token;
              // When Role & Permissions
              if (res.data) {
                this.userId = res.data._id;
                this.gender = res.data.gender;
              }
              // When Token
              if (res.token) {
                this.isUser = true;
                this.userStatusListener.next(true);
                // For Token Expired Time..
                const expiredInDays = Number(res.tokenExpiredInDays.replace('d', ''));
                this.setSessionTimer(expiredInDays * 86400000);
                const now = new Date();
                const expirationDate = this.utilsService.getNextDateString(new Date(now.getTime() - 3600 * 1000), expiredInDays);
                // Store to Local
                this.saveUserData(res.token, expirationDate, this.userId, this.gender);


                // Snack bar..

                this.presentToast('bottom', res.message, 'success').then();

                // Navigate..
                if (navigateFrom) {
                  this.router.navigate([navigateFrom]);
                } else {
                  this.router.navigate([environment.userBaseUrl]);
                }
                resolve(res);
              }
            } else {

              this.presentToast('bottom', res.message, 'danger').then();

              this.userStatusListener.next(false);
            }
          },
          (error) => {
            // Error History
            const mData = {
              collection: 'User Signup and Login Error by UI',
              apiName: "signup-and-login",
              errorMessage: error.message ? error.message.toString() : error
            }
            this.userDataService.errorCheckAndStore(mData)

            console.log(error);
            this.userStatusListener.next(false);
            reject(error);
          }
        );
    });
  }

  userSignupAndLoginSocial(data: User, navigateFrom?: string) {
    this.httpClient
      .post<UserAuthResponse>(API_URL_USER + 'social-signup-and-login', data)
      .subscribe(
        async (res) => {
          if (res.success) {
            this.token = res.token;
            // When Role & Permissions
            if (res.data) {
              this.userId = res.data._id;
              this.gender = res.data.gender;
            }
            // When Token
            if (res.token) {
              this.isUser = true;
              this.userStatusListener.next(true);

              // For Token Expired Time..
              const expiredInDays = Number(res.tokenExpiredInDays.replace('d', ''));
              this.setSessionTimer(expiredInDays * 86400000);
              const now = new Date();
              const expirationDate = this.utilsService.getNextDateString(new Date(now.getTime() - 3600 * 1000), expiredInDays);

              // Store to Local
              this.saveUserData(res.token, expirationDate, this.userId,this.gender);



              // Snack bar..

              this.presentToast('bottom', res.message, 'success').then();

              // Navigate..
              if (navigateFrom) {
                this.router.navigate([navigateFrom]);
              } else {
                this.router.navigate([environment.userBaseUrl]);
              }
            }
          } else {

            this.presentToast('bottom', res.message, 'danger').then();

            this.userStatusListener.next(false);
          }
        },
        (error) => {
          console.log(error);
          this.userStatusListener.next(false);
          // console.log(error);
        }
      );
  }

  userLogin(
    data: { username: string; password: string },
    navigateFrom?: string
  ) {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post<UserAuthResponse>(API_URL_USER + 'login', data)
        .subscribe(
          async (res) => {
            if (res.success) {
              this.token = res.token;
              // When Role & Permissions
              if (res.data) {
                this.userId = res.data._id;
                this.gender = res.data.gender;
              }
              // When Token
              if (res.token) {
                this.isUser = true;
                this.userStatusListener.next(true);
                // For Token Expired Time..
                const expiredInDays = Number(res.tokenExpiredInDays.replace('d', ''));
                this.setSessionTimer(expiredInDays * 86400000);
                const now = new Date();
                const expirationDate = this.utilsService.getNextDateString(new Date(now.getTime() - 3600 * 1000), expiredInDays);

                // Store to Local
                this.saveUserData(res.token, expirationDate, this.userId,this.gender);

                this.presentToast('top', res.message, 'success').then();

                // Navigate..
                if (navigateFrom) {
                  this.router.navigate([navigateFrom]);
                } else {
                  this.router.navigate([environment.userBaseUrl]);
                }
                resolve(res);


              }
            } else {

              this.presentToast('bottom', res.message, 'danger').then();

              this.userStatusListener.next(false);
              resolve(res);
            }
          },
          (error) => {
            console.log(error);
            this.userStatusListener.next(false);
            reject(error);
          }
        );
    });
  }

  /**
   * USER AFTER LOGGED IN METHODS
   * autoUserLoggedIn()
   * userLogOut()
   */
  autoUserLoggedIn() {
    const authInformation = this.getUserData();
    if (!authInformation) {
      this.storageService.removeDataFromEncryptLocal(
        DATABASE_KEY.encryptUserLogin
      );
      return;
    }
    const now = new Date();
    const expDate = new Date(authInformation.expiredDate);
    const expiresIn = expDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userStatusListener.next(true);
      this.isUser = true;
      this.userId = authInformation.userId;
      this.setSessionTimer(expiresIn);
    }
  }

  userLogOut() {
    this.token = null;
    this.isUser = false;

    this.userStatusListener.next(false);
    this.reloadService.needRefreshCart$(false);
    this.reloadService.needRefreshData$();
    // Clear Token from Storage..
    this.clearUserData();
    // Clear The Token Time..
    clearTimeout(this.tokenTimer);
    // Navigate..
    this.router.navigate([environment.userLoginUrl]);
    // window.location.reload();
  }

  /**
   * GET LOGGED IN BASE DATA
   * getUserStatus()
   * getUserToken()
   * getUserId()
   * getUserStatusListener()
   */

  getUserStatus() {
    return this.isUser;
  }

  getUserToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getUserGender() {
    return this.gender;
  }

  getUserStatusListener() {
    return this.userStatusListener.asObservable();
  }

  /**
   * Save & GET User Info Encrypt to Local
   * saveUserData()
   * clearUserData()
   * getUserData()
   * setSessionTimer()
   */
  protected saveUserData(token: string, expiredDate: Date, userId: string,gender:string) {
    const data = {
      token,
      expiredDate,
      userId,
      gender,
    };
    this.storageService.addDataToEncryptLocal(
      data,
      DATABASE_KEY.encryptUserLogin
    );
  }

  protected clearUserData() {
    this.storageService.removeDataFromEncryptLocal(
      DATABASE_KEY.encryptUserLogin
    );
  }

  protected getUserData() {
    return this.storageService.getDataFromEncryptLocal(
      DATABASE_KEY.encryptUserLogin
    );
  }

  private setSessionTimer(durationInMs: number) {
    this.tokenTimer = setTimeout(() => {
      this.userLogOut();
    }, durationInMs); // 1s = 1000ms
    // console.log('Setting Time: ' + duration);
  }

  /**
   * SOCIAL LOGIN
   * GoogleAuthWithSocialAuth()
   */
  // GoogleAuthWithSocialAuth(): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
  //     .then(m => {
  //       console.log('user', m);
  //       // const user: User = {
  //       //   name: m.name,
  //       //   username: m.id,
  //       //   password: null,
  //       //   phoneNo: null,
  //       //   profileImg: m.photoUrl,
  //       //   email: m.email ? m.email : null,
  //       //   hasAccess: true,
  //       //   registrationType: 'google',
  //       // };
  //       // this.userSignupAndLoginSocial(user);
  //     })
  //     .catch(err => {
  //       console.log('err', err);
  //     });
  // }
  //
  // FacebookAuthWithSocialAuth(): void {
  //   this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
  //     .then(m => {
  //       const user: User = {
  //         name: m.name,
  //         username: m.id,
  //         password: null,
  //         phoneNo: null,
  //         profileImg: m.photoUrl,
  //         email: m.email ? m.email : null,
  //         hasAccess: true,
  //         registrationType: 'facebook',
  //       };
  //       console.log('user', user);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  /**
   * ON SUCCESS LOGIN
   */

  public onSuccessLogin(
    token: string,
    expiredIn: number,
    id: string,
    redirectFrom?: string,
    fromRegistration?: boolean
  ) {
    console.log('token,expiredIn,id', token, expiredIn, id);
    this.isUser = true;
    this.userStatusListener.next(true);

    // For Token Expired Time..
    const expiredInDuration = expiredIn;
    this.setSessionTimer(expiredInDuration);

    // Save Login Time & Expiration Time & Token to Local Storage..
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiredInDuration * 1000);

    this.saveUserData(token, expirationDate, id,this.gender);

    // Snack bar..

    this.presentToast('bottom', 'Welcome! Login Success.', 'success').then();


    // Navigate with Auth..
    if (redirectFrom) {
      this.router.navigate(['/account/', 'basic-info']);
    } else {
      this.router.navigate([environment.userBaseUrl]);
    }
  }




  /**
   * Toast Message
   * presentToast()
   */
  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color: 'danger' | 'warning' | 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position,
      color: color,
    });

    await toast.present();
  }

}
