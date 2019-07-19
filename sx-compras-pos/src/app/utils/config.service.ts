import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';
import * as fromRoot from '../store';
import * as fromApplication from '../store/actions/application.actions';

import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Sucursal } from '../models/sucursal';

@Injectable()
export class ConfigService {
  private config: any;

  private apiUrl: string;

  private configurationUrl = environment.apiConfiguartionFile;

  constructor(private http: HttpClient, private store: Store<fromRoot.State>) {}

  getAppConfig() {
    return this.config;
  }

  getCurrentSucursal(): Sucursal {
    return this.config.sucursal;
  }

  getApiUrl() {
    return this.getProperty('apiUrl');
  }

  buildApiUrl(endpoint: string) {
    return `${this.getApiUrl()}/${endpoint}`;
  }

  load(): Promise<any> {
    const promise = this.http
      .get(this.configurationUrl)
      .pipe(tap(config => console.log('Config: ', config)))
      .toPromise();
    promise.then(config => {
      this.config = config; // <--- THIS RESOLVES AFTER
    });
    return promise;
  }

  private getProperty(property: string): any {
    //noinspection TsLint
    if (!this.config) {
      throw new Error(`Attempted to access configuration property before configuration data was loaded,
      please double check that 'APP_INITIALIZER is properly implemented.`);
    }

    if (!this.config[property]) {
      throw new Error(`
      Required property ${property} was not defined within the configuration object. Please double check the
      assets/config.json file`);
    }
    return this.config[property];
  }
}
