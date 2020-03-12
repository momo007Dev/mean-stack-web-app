import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _flashMessagesService: FlashMessagesService) {
  }

  ngOnInit() {
    if (this.authService.getProfile() === undefined) {
      return this._flashMessagesService.show("No profile found !", {
        cssClass: "alert-danger",
        timeout: 5000
      });
    } else {
      this.authService.getProfile().subscribe(
        (profile: any) => {
          //const {user} = profile;
          this.user = profile.user;
          //console.log(profile);
          // console.log(user.userId);
          // console.log(user.email);
          //console.log(user.password);
        },
        err => {
          console.log(err);
          return false;
        }
      );
    }

  }
}

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

