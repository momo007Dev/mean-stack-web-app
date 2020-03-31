import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {FlashMessagesService} from 'angular2-flash-messages';
import {tryCatch} from "rxjs/internal-compatibility";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;
  token : any;
  userId: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _flashMessagesService: FlashMessagesService) {
  }


  ngOnInit() {
    if (this.authService.getAllProfiles() === undefined) {
      this.authService.logout();
      return this._flashMessagesService.show("You need to log in !", {
        cssClass: "alert-danger w-50 p-3",
        timeout: 2000,
        navigate: `${this.router.navigate(['/login'])}`
      });
    } else {
      this.authService.getProfile().subscribe(
        (profile: any) => {
          this.user = profile.user;
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

