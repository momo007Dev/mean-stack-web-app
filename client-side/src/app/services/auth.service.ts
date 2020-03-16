import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;
  currentUser : any;


  constructor(private _http: HttpClient) {
  }

  registerUser(user : any) {
    return this._http.post('/server/api/signup', user, {headers});
  }

  loginUser(user : any) {
    return this._http.post('/server/api/login', user, {headers});
  }

  getProfile() {
    this.getToken();
    //console.log(this.authToken);
    //console.log(JSON.parse(this.user).userId);
    if (this.authToken) {
      const httpAuthHeaders = new HttpHeaders()
        .set('Authorization', this.authToken);
      return this._http.get(`/server/api/user/profile/${JSON.parse(this.user).userId}`,
        {headers: httpAuthHeaders});
    }
  }

  getAllProfiles() {
    this.getToken();
    if (this.authToken) {
      const httpAuthHeaders = new HttpHeaders()
        .set('Authorization', this.authToken);
      return this._http.get('/server/api/users/profiles/',
        {headers: httpAuthHeaders});
    }
  }

  storeUserData(data : any) {
    localStorage.setItem("id_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    this.authToken = data.token;
    this.user = data.user;
    this.currentUser = data.user.userId;
  }

  getToken() {
    this.authToken = localStorage.getItem("id_token");
    this.user = localStorage.getItem("user");
  }

  getId(){
    return this.user.userId;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
    //localStorage.clear();
  }

  loggedIn() {
    //let keys = Object.keys(localStorage);
   // console.log(this.user);
    return !!this.authToken;
  }
}

/*
function mkBt(id) {
    return '<button id="' + id + '" onclick="affich(\'' + id + '\');">'
    + "Details" + '</button>';

}
 */

