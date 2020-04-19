import {Component, OnInit} from '@angular/core';
import {FlashMessagesService} from "angular2-flash-messages";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {QuestionsService} from "../../services/questions.service";
import {ReplacePipe} from "../../pipes/replace.pipe";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  option: any;
  progress: number = 0;
  dynamicForm: FormGroup;
  tab: Array<number> = [];

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
    private question: QuestionsService,
    private replacePipe: ReplacePipe,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {

    this.dynamicForm = this.formBuilder.group({
      tickets: new FormArray([])
    });


    this.question.qnProgress = 0;
    this.question.seconds = 0;
    this.showQuestion();
    this.startTimer();

    if (!Object.keys(localStorage).includes('id_token')) {
      return this._flashMessagesService.show("", {
        navigate: `${this.router.navigate(['/login'])}`
      });
    }
  }

  showQuestion() {
    this.question.getQuestions()
      .toPromise()
      .then((data: any) => {

        data.filter(x => x.type === 'fill in')
          .forEach((x, i) => {
            x.regexAnswer = this.question.getAnswer(x.question);
            x.question = this.replacePipe.transform(x.question);
            this.tab.push(x.regexAnswer.length);
            console.log(this.tab);
          });

        data.forEach((x, i) => {
          x.questionNumber = ++i;
        });

        this.question.qns = data;
        this.question.correctAnswerCount = 0;
      })
      .catch(err => {
        console.log(err);
      });
  }

  get f() {
    return this.dynamicForm.controls;
  }

  get t() {
    return this.f.tickets as FormArray;
  }

  onChangeTickets() {
    const numberOfTickets = this.tab[this.progress] || 0;
    if (this.t.length < numberOfTickets) {
      for (let i = this.t.length; i < numberOfTickets; i++) {
        this.t.push(this.formBuilder.group({
          name: ['', Validators.required]
        }));
      }
    } else {
      for (let i = this.t.length; i >= numberOfTickets; i--) {
        this.t.removeAt(i);
      }
    }
  }

  test() {
    console.log(this.dynamicForm.value);
    this.question.qnProgress++;
    this.progress++;
  }

  test1(){
    console.log(this.dynamicForm.value);
    this.question.qnProgress--;
    this.progress--;
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

    if (JSON.parse(this.question.qns[this.question.qnProgress].answer)) {
      this.question.correctAnswerCount++;
    }

    /**
     * if (JSON.parse(choice.toLowerCase())) {
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
     */

    this.question.qnProgress++;
    if (this.question.qnProgress == (this.question.qns).length) {
      this.question.timeTaken = this.question.displayTimeElapsed();
      clearInterval(this.question.timer);
      await this.router.navigate(['/results']);
    }
  }
}
