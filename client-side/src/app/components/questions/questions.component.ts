import {Component, OnInit} from '@angular/core';
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
    private question: QuestionsService
  ) {
  }

  ngOnInit() {
    this.question.qnProgress = 0;
    this.question.seconds = 0;
    this.showQuestion();
    this.startTimer();

    if (this.authService.getProfile() === undefined) {
      return this._flashMessagesService.show("", {
        navigate: `${this.router.navigate(['/login'])}`
      });
    }
  }

  showQuestion() {
    this.question.getQuestions()
      .toPromise()
      .then((data: any) => {
        //console.log(data[0].answers.forEach(x => console.log(x.isCorrect)));
        this.question.qns = data;
       // this.question.qns.forEach(y => console.log(y.question,y.answers.forEach(x => console.log(x.option, x.isCorrect))));
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

  async answer(index, choice) {
    this.question.qns[this.question.qnProgress].answer = choice;
    this.question.qns[this.question.qnProgress].index = index;
     //console.log(qID, choice);
     console.log(this.question.qns[this.question.qnProgress].answer);
     console.log(this.question.qns[this.question.qnProgress].index);
    if (JSON.parse(choice.toLowerCase())) {
      this._flashMessagesService.show("correct answer", {
        cssClass: "alert-success w-25 text-center",
        timeout: 2000
      });
    } else {
      this._flashMessagesService.show("wrong answer", {
        cssClass: "alert-danger w-25 text-center",
        timeout: 2000,
      });
    }
    await new Promise(r => setTimeout(r, 2000));
    this.question.qnProgress++;
    if (this.question.qnProgress == (this.question.qns).length) {
      clearInterval(this.question.timer);
      await this.router.navigate(['/results']);
    }
  }
}
