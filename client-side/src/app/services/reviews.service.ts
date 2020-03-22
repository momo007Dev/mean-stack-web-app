import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  rev: any[];

  constructor(private _http: HttpClient) {
  }

  getAllReviews() {
    return this._http.get('/server/api/reviews/all', {headers});
  }

  createReview(review: any) {
    const userId = JSON.parse(localStorage.getItem('user')).userId;
    return this._http.post(`/server/api/user/${userId}/reviews`, review, {headers});

  }
}
