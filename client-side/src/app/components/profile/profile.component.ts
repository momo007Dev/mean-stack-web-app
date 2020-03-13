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
      return this._flashMessagesService.show("You need to log in !", {
        cssClass: "alert-danger",
        timeout: 2000,
        navigate: `${this.router.navigate(['/login'])}`
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
  /*
    onClick(event : any){
    console.log(event);
    console.log(event.srcElement.formAction);
  }
   */

}

