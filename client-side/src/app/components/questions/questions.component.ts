import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from "angular2-flash-messages";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {QuestionsService} from "../../services/questions.service";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
    private question : QuestionsService
  ) { }

  ngOnInit() {
    this.question.qnProgress = 0;
    this.question.seconds =0;
    this.showQuestion();
    this.startTimer();

  }

  showQuestion(){
    this.question.getQuestions()
      .toPromise()
      .then((data : any) => {
        //console.log(data);data.forEach(x => console.log(x.question, (x.answers)));
        //console.log(data[0].answers.forEach(x => console.log(x.isCorrect)));
        this.question.qns = data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  startTimer() {
    this.question.timer = setInterval(() => {
      this.question.seconds++;
      localStorage.setItem('seconds', this.question.seconds.toString());
    }, 1000);
  }

  Answer(qID, choice) {
    this.question.qns[this.question.qnProgress].answer = choice;
    localStorage.setItem('qns', JSON.stringify(this.question.qns));
    this.question.qnProgress++;
    localStorage.setItem('qnProgress', this.question.qnProgress.toString());
    if (this.question.qnProgress == 10) {
      clearInterval(this.question.timer);
      this.router.navigate(['/result']);
    }
  }
}
