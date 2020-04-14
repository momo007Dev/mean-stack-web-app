import {Component, OnInit} from '@angular/core';
import {FlashMessagesService} from "angular2-flash-messages";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {QuestionsService} from "../../../services/questions.service";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  private level : any;
  private userLevel : string;
  private userInfo : any;

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
    private questions: QuestionsService
  ) {
  }

  ngOnInit() {

    if (!Object.keys(localStorage).includes('id_token')) {
      return this._flashMessagesService.show("", {
        navigate: `${this.router.navigate(['/login'])}`
      });
    }
    const userScore = {
      "score" : this.questions.correctAnswerCount
    };
    this.authService.updateScore(userScore)
      .toPromise()
      .then()
      .catch(err => {
        console.log(err);
      });
    this.getLevel();
  }

  getLevel(){
    this.authService.getProfile()
      .toPromise()
      .then( (data: any) => {
        this.userInfo = data;
        this.userLevel = data.user.level;
        this.level = this.questions.getLevelDesc(this.userLevel);
        console.log(this.level["1"]);
      })
      .catch(err => {
        console.log(err);
      });
  }

}
