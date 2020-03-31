import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  constructor(private authService: AuthService,
              private _flashMessagesService: FlashMessagesService,
              private router: Router
  ) {
  }

  ngOnInit() {
    if (!Object.keys(localStorage).includes('id_token')) {
      this.authService.logout();
      return this._flashMessagesService.show("", {
        navigate: `${this.router.navigate(['/login'])}`
      });
    }
  }


}
