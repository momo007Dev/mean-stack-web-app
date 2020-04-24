import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  rev: any[];
  userId: any;

  constructor(private _http: HttpClient) {
  }

  getAllReviews() {
    return this._http.get('/server/api/reviews/all', {headers});
  }

  createReview(review: any) {
    const userId = JSON.parse(localStorage.getItem('user')).userId;
    return this._http.post(`/server/api/user/${userId}/reviews`, review, {headers});

  }

  updateReview(userEmail: any, reviewId: any, review: any) {
    // /user/5e7fd9d5f35b123cbc246899/reviews/5e862f463f21584038c3d362
    return this._http
      .patch(`/server/api/user/${userEmail}/reviews/${reviewId}`, review, {headers});
  }

  deleteReview(userEmail: any, reviewId: any) {
    // /user/5e7fd9d5f35b123cbc246899/reviews/5e862f463f21584038c3d362
    //const userId = JSON.parse(localStorage.getItem('user')).userId;
    return this._http
      .delete(`/server/api/user/${userEmail}/reviews/${reviewId}`, {headers});
  }

}
