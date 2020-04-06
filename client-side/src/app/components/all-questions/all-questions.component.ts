import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from "angular2-flash-messages";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {QuestionsService} from "../../services/questions.service";

@Component({
  selector: 'app-all-questions',
  templateUrl: './all-questions.component.html',
  styleUrls: ['./all-questions.component.css']
})
export class AllQuestionsComponent implements OnInit {

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
    private questions: QuestionsService
  ) {
  }

  ngOnInit() {
    this.showAllQuestion();
  }

  showAllQuestion() {
    this.questions.getQuestions()
      .toPromise()
      .then((data: any) => {
        //console.log(data[0].answers.forEach(x => console.log(x.isCorrect)));
        this.questions.qns = data;
        this.questions.correctAnswerCount = 0;
        // this.question.qns.forEach(y => console.log(y.question,y.answers.forEach(x => console.log(x.option, x.isCorrect))));
      })
      .catch(err => {
        console.log(err);
      });
  }

  check(event){
    console.log(event.checked);
  }
}
