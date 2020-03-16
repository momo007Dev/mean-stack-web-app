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
    this.sessionExpired();
    if (this.authService.getProfile() === undefined) {
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

  async sessionExpired(){
    await new Promise(r => setTimeout(r, 30000));
    this.authService.logout();
    this._flashMessagesService
      .show("Your session is over, you can log in back in to start a new session.",
        {
      cssClass: "alert-danger text-center ",
      timeout: 10000,
      navigate: `${await this.router.navigate(['/login'])}`
    });
  }
  /*
    onClick(event : any){
    console.log(event);
    console.log(event.srcElement.formAction);
  }
   */

}

