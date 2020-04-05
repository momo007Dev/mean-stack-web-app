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

  getDate(){
    return new Date().getTime();
  }

  convertMS(ms) {
    let day, hour, min, sec, w, mon, year;
    sec = Math.floor(ms / 1000);
    min = Math.floor(sec / 60);
    sec = sec % 60;
    hour = Math.floor(min / 60);
    min = min % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    w = Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
    mon = Math.floor(ms / (4 * 7 * 24 * 60 * 60 * 1000));
    year = Math.floor(ms / (12 * 4 * 7 * 24 * 60 * 60 * 1000));
    return {year: year, mon: mon, w: w, d: day, h: hour, m: min, s: sec};
  };

  formatDate(ms) {
    if ((this.convertMS(ms).s <= 60) && ((this.convertMS(ms).m) === 0)) {
      return (this.convertMS(ms).s <= 1) ? this.convertMS(ms).s + ' second ago' : this.convertMS(ms).s + ' seconds ago';
    } else if ((this.convertMS(ms).m <= 60) && ((this.convertMS(ms).h) === 0)) {
      return (this.convertMS(ms).m <= 1) ? this.convertMS(ms).m + ' minute ago' : this.convertMS(ms).m + ' minutes ago';
    } else if ((this.convertMS(ms).h <= 24) && ((this.convertMS(ms).d) === 0)) {
      return (this.convertMS(ms).h <= 1) ? this.convertMS(ms).h + ' hour ago' : this.convertMS(ms).h + ' hours ago';
    } else if ((this.convertMS(ms).d <= 7) && ((this.convertMS(ms).w) == 0)) {
      return (this.convertMS(ms).d <= 1) ? this.convertMS(ms).d + ' day ago' : this.convertMS(ms).d + ' days ago';
    } else if ((this.convertMS(ms).w <= 4) && ((this.convertMS(ms).mon) == 0)) {
      return (this.convertMS(ms).w <= 1) ? this.convertMS(ms).w + ' week ago' : this.convertMS(ms).w + ' weeks ago';
    } else if ((this.convertMS(ms).mon <= 12) && ((this.convertMS(ms).year) == 0)) {
      return (this.convertMS(ms).mon <= 1) ? this.convertMS(ms).mon + ' month ago' : this.convertMS(ms).mon + ' months ago';
    } else {
      return (this.convertMS(ms).year <= 1) ? this.convertMS(ms).year + ' year ago' : this.convertMS(ms).year + ' years ago';
    }
  }

}
