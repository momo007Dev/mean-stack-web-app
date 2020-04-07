import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from "angular2-flash-messages";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit {

  users: any;

  sortUsername: boolean = false;
  sortScore: boolean = false;
  sortEmail: boolean = false;

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.showUsersInTable();
  }

  showUsersInTable() {
    this.authService.getAllProfiles()
      .toPromise()
      .then((data: any) => {
        this.users = data.filter(x => x.username !== 'admin' && x.username !== 'teacher');
      })
      .catch(err => {
        console.log(err);
      });
  }

  sortByUsername(event) {
    if (event.id === 'username'){
      if (this.sortUsername) {
        this.sortUsername = false;
        this.users.sort((a, b) => (a.username < b.username) ? 1
          : (a.username > b.username) ? -1 : 0);
      } else {
        this.sortUsername = true;
        this.users.sort((a, b) => (a.username > b.username) ? 1
          : (a.username < b.username) ? -1 : 0);
      }
    } else if (event.id === 'score'){
      if (this.sortScore) {
        this.sortScore = false;
        this.users.sort((a, b) => (a.score - b.score));
      } else {
        this.sortScore = true;
        this.users.sort((a, b) => (b.score - a.score));
      }

    } else if (event.id === 'email'){
      if (this.sortEmail) {
        this.sortEmail = false;
        this.users.sort((a, b) => (a.email < b.email) ? 1
          : (a.email > b.email) ? -1 : 0);
      } else {
        this.sortEmail = true;
        this.users.sort((a, b) => (a.email > b.email) ? 1
          : (a.email < b.email) ? -1 : 0);
      }
    }
  }

}
