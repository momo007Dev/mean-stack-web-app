import { Component, OnInit } from '@angular/core';
import {ValidateService} from "../../services/validate.service";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string;

  constructor(private validateService: ValidateService) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const user = {
      email: this.email,
      password: this.password
    };

    if (!this.validateService.validateRegister(user)) {
      console.log('please fill in all fields');
    }
  }



}
