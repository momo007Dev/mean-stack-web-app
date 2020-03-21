import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  rev: any[];
  revProgress: number;

  constructor(private _http: HttpClient) { }

  getAllReviews() {
    return this._http.get('/server/api/reviews/all', {headers});
  }
}
