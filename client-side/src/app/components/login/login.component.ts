import {Component, OnInit} from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ValidateService} from "../../services/validate.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: String;
  password: String;

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
        cssClass: "alert-danger",
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
         this.authService.storeUserData(data);
          this._flashMessagesService.show("You are now logged in", {
            cssClass: "alert-success",
            timeout: 1000,
            navigate: `${this.router.navigate(['/dashboard'])}`
          });
        }
      )
      .catch(err => {
        //console.log(err.error);
        console.log(err);
        this._flashMessagesService.show("Something went wrong", {
          cssClass: "alert-danger",
          timeout: 3000
        });
      });

  }
}
