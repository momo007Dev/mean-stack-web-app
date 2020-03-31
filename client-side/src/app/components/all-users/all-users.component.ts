import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  users: any[];

  constructor(private authService: AuthService,
              private _flashMessagesService: FlashMessagesService,
              private router: Router
  ) {
  }

  ngOnInit() {

    if (!this.authService.getAllProfiles() || (this.authService.role !== 'admin' &&
      this.authService.role !== 'teacher')) {
      this.authService.logout();
      return this._flashMessagesService.show("", {
        navigate: `${this.router.navigate(['/home'])}`
      });
    }

    this.authService.getAllProfiles()
      .toPromise()
      .then((data : any) => {
        //data.forEach(x => console.log(x.email));
        this.users = data;
      })
      .catch(err => {
        // catching unauthorized http reponses from the server
        //console.log(err.status);
      });
  }
}
