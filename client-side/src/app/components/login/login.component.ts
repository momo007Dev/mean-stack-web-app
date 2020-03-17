import {Component, OnInit} from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ValidateService} from "../../services/validate.service";
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: String;
  password: String;
  timeLoggedIn : number;

  constructor(private validateService: ValidateService,
              private _flashMessagesService: FlashMessagesService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
  }

  onLoginSubmit() {
    const user = {
      email: this.email,
      password: this.password
    };

    if (!this.validateService.validateRegister(user)) {

      this._flashMessagesService.show("Please fill in all fields", {
        cssClass: "alert-danger w-25",
        timeout: 2000,
        navigate: ''
      });

      return false;
    }

    this.authService.loginUser(JSON.stringify(user))
      .toPromise()
      .then((data: any) => {
        //console.log(data.user.userId);
        //console.log(data.token);
        this.timeLoggedIn = new Date().getTime();
        this.sessionExpired(data.token);
         this.authService.storeUserData(data);
          this._flashMessagesService.show("You are now logged in ...", {
            cssClass: "alert-success w-25",
            timeout: 2000,
            navigate: `${this.router.navigate(['/dashboard'])}`
          });
        }
      )
      .catch(err => {
        //console.log(err.error);
        console.log(err);
        this._flashMessagesService.show("Something went wrong", {
          cssClass: "alert-danger w-25",
          timeout: 3000
        });
      });

  }

  sessionExpired(token : string) {
    const expirationDate = new JwtHelperService().getTokenExpirationDate(token).getTime();
    const sessionExpired = expirationDate - this.timeLoggedIn;
    setTimeout(() => {
      this.authService.logout();
      this._flashMessagesService
        .show("Your session is over, you can log in back in to start a new session.",
          {
            cssClass: "alert-danger text-center ",
            timeout: 10000,
            navigate: `${this.router.navigate(['/login'])}`
          });
    }, sessionExpired);
  }

}
