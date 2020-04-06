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

  question: any;
  option1: any;
  option2: any;
  option3: any;
  option4: any;
  test: any;
  tab: Array<any> = [];

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

    //console.log(event.checked);
    console.log(event.id);
    (event.checked) ? this.tab.push(event.id): undefined;
    console.log(this.tab);
  }

  toto(){
     if (this.tab.length === 1) {
      return true;
    } else if (this.tab.length >= 1) {
       this.tab.splice(-1);
         return false;
       }
  }

  onCreateQuestion(){
    console.log("toto");
  }
}
