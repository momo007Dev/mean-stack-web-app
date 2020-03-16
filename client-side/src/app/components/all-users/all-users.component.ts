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

    if (!this.authService.getAllProfiles()) {
      return this._flashMessagesService.show("", {
        navigate: `${this.router.navigate(['/login'])}`
      });
    }

    this.authService.getAllProfiles()
      .toPromise()
      .then((data : any) => {
        console.log(data);
        data.forEach(x => console.log(x.email));
        this.users = data;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
