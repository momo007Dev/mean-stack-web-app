import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;


  constructor(private _http: HttpClient) {
  }

  registerUser(user) {
    return this._http.post('/server/api/signup', user, {headers});
  }

  loginUser(user) {
    return this._http.post('/server/api/login', user, {headers});
  }

  storeUserData(data) {
    localStorage.setItem("id_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    this.authToken = data.token;
    this.user = data.user;
    console.log(this.authToken);
  }


  getProfile() {
    console.log(localStorage.getItem('id_token'));
   // const head = new HttpHeaders().set('Authorization', this.authToken);
    //headers.append('Authorization', ` ${this.authToken}`);
    //const httpOptions : { headers: HttpHeaders } = {headers: new HttpHeaders().set('Authorization', ` ${this.authToken}`)};
    const httpHeaders = new HttpHeaders()
      .set('Authorization', localStorage.getItem('id_token'));
    return this._http.get('/server/api/user/profile/5e679888d503b41c34c35446',
       {headers :httpHeaders});
  }

  getToken() {
    return this.authToken;
  }


  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
    //localStorage.clear();
  }

}
