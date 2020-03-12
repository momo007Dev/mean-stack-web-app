import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() {
  }

  validateRegister(user) {
    return !(!user.email || !user.password);
  }
}