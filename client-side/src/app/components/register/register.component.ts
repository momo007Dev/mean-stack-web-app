import {Component, OnInit} from '@angular/core';
import {ValidateService} from "../../services/validate.service";
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string;

  constructor(private validateService: ValidateService,
              private _flashMessagesService: FlashMessagesService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      email: this.email,
      password: this.password
    };

    if (!this.validateService.validateRegister(user)) {

      this._flashMessagesService.show("Please fill in all fields", {
        cssClass: "alert-danger",
        timeout: 3000
      });
      return false;
    }

    // register
    this.authService.registerUser(JSON.stringify(user))
      .toPromise()
      .then(() => {
          // console.log(data.success);
          this._flashMessagesService.show("You are now registered", {
            cssClass: "alert-success",
            timeout: 3000
          });
          this.router.navigate(['/login']).then(nav => {
            //console.log(nav); // true if navigation is successful
          }, err => {
            //console.log(err) // when there's an error
          });
        }
      )
      .catch(err => {
        //console.log(err.error);
        console.log(err);
        this._flashMessagesService.show("Something went wrong", {
          cssClass: "alert-danger",
          timeout: 3000,
          navigate: `${this.router.navigate(['/register'])}`
        });
      });

  }
}
