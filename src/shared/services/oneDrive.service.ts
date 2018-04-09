import { Injectable, EventEmitter } from '@angular/core';
import * as hello from 'hellojs/dist/hello.all.js';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { AuthService } from './auth.service';

function extractData(res: Response): any {
  const body = res.json();
  return body || {};
}

function handleError(res: Response) {
  const error = res.json();

  const errorMessage = error.message ? error.message :
    res.status ? `${res.status} - ${res.statusText}` : 'Server error';

  return Observable.throw(errorMessage);
}

@Injectable()
export class OneDriveService {
	URL = 'https://graph.microsoft.com/v1.0';
	folders: any = {};
	worksheets: any = {};
	selectedCity: string = "";
	selectedCityId: string = "";
	selectedCityUpdated: EventEmitter<any> = new EventEmitter();
	cities = [];

	constructor(
		private http: Http,
		private authService: AuthService
	) {

	}

	setCity(city, id) {
		this.selectedCity = city;
		this.selectedCityId = id;
		this.selectedCityUpdated.emit();
	}

	getProfile() {
		return this.http
	      .get(`${this.URL}/me`, this.authService.getAuthRequestOptions())
	      .map(extractData)
	      .catch(handleError);
	}

	getFolders(id?): Observable<any> {
		if(id && this.folders[id]) {
			return Observable.of(this.folders[id]).map(fo => ({ value: fo }));
		} else if(!id && this.folders.all) {
			return Observable.of(this.folders.all).map(fo => ({ value: fo }));
		} else {
			return this.http
		      .get(this.URL + (!id ? '/me/drive/root/children' : `/me/drive/items/${id}/children`), this.authService.getAuthRequestOptions())
		      .map(extractData)
		      .catch(handleError);	
		}
	}

	getWorkbook(id, sheet): Observable<any> {
		if(this.worksheets[id]) {
			return Observable.of(this.worksheets[id]).map(ws => (ws));
		} else 
			return this.http
		      .get(`${this.URL}/me/drive/items/${id}/workbook/worksheets('${sheet}')/usedRange`, this.authService.getAuthRequestOptions())
		      .map(extractData)
		      .catch(handleError);
	}

	updateWorkbook() {
		
	}
}