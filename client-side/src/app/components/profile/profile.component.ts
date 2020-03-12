import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;
  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  this.authService.getProfile().subscribe(
    (profile : any) => {
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
