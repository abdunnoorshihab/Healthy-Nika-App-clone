import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppVersion } from '../../interfaces/core/app-version.interface';

const API_APP_VERSION = environment.apiBaseLink + '/api/app-version/';


@Injectable({
  providedIn: 'root'
})
export class AppVersionService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * getAppVersion()
  */
  getAppVersion() {
    return this.httpClient.get<{ data: AppVersion, message: string, success: boolean }>(API_APP_VERSION + 'get');
  }

}
