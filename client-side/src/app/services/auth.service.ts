import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';

const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;
  role: any;

  constructor(private _http: HttpClient) {
  }

  registerUser(user: any) {
    return this._http.post('/server/api/signup', user, {headers});
  }

  loginUser(user: any) {
    return this._http.post('/server/api/login', user, {headers});
  }

  getProfile() {
    this.getToken();
    //console.log(this.authToken);
    //console.log(JSON.parse(this.user).userId);
    if (this.authToken) {
      const httpAuthHeaders = new HttpHeaders()
        .set('Authorization', this.authToken);
      return this._http.get(`/server/api/user/${JSON.parse(this.user).userId}`,
        {headers: httpAuthHeaders});
    }
  }


  updateScore(user: any) {
    this.getToken();
    if (this.authToken) {
      const httpAuthHeaders = new HttpHeaders()
        .set('Authorization', this.authToken);
      return this._http.patch(`/server/api/user/${JSON.parse(this.user).userId}/score`,
        user, {headers: httpAuthHeaders});
    }
  }


  getAllProfiles() {
    this.getToken();
    //console.log(this.authToken);
    if (this.authToken) {
      const httpAuthHeaders = new HttpHeaders()
        .set('Authorization', this.authToken);
      return this._http.get('/server/api/users/profiles/',
        {headers: httpAuthHeaders});
    }
  }

  storeUserData(data: any) {
    localStorage.setItem("id_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("score", data.user.score);
    this.authToken = data.token;
    this.user = data.user;
    this.role = data.user.role;
  }

  getToken() {
    //console.log(new JwtHelperService().isTokenExpired(this.authToken));
    //console.log(new JwtHelperService().getTokenExpirationDate(this.authToken));
    this.authToken = localStorage.getItem("id_token");
    this.user = localStorage.getItem("user");
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

