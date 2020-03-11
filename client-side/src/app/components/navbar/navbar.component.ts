import {Component, OnInit} from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ValidateService} from "../../services/validate.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private validateService: ValidateService,
              private _flashMessagesService: FlashMessagesService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
  }

  onLogOutClick() {

    if(!localStorage.getItem('id_token')) {
      this.authService.logout();
      this._flashMessagesService.show("Please log in first", {
        cssClass: "alert-danger",
        timeout: 3000
      });
      return false;
    } else {
      this.authService.logout();
      this._flashMessagesService.show("You are logged out", {
        cssClass: "alert-success",
        timeout: 3000,
        navigate: `${this.router.navigate(['/login'])}`
      });
      return false;
    }



  }
}
