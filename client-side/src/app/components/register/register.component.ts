import { Component, OnInit } from '@angular/core';
import {ValidateService} from "../../services/validate.service";
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string;

  constructor(private validateService: ValidateService,
              private _flashMessagesService: FlashMessagesService) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const user = {
      email: this.email,
      password: this.password
    };
    console.log(user.email);

    if (this.validateService.validateRegister(user)) {

      this._flashMessagesService.show("please fill in all fields", {
        cssClass: "alert-danger",
        timeout: 3000
      });
      return false;
    }
  }



}
