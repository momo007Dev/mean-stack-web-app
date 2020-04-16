import {Component, OnInit} from '@angular/core';
import {FlashMessagesService} from "angular2-flash-messages";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {QuestionsService} from "../../../services/questions.service";
import {ReplacePipe} from "../../../pipes/replace.pipe";

@Component({
  selector: 'app-all-questions',
  templateUrl: './all-questions.component.html',
  styleUrls: ['./all-questions.component.css']
})
export class AllQuestionsComponent implements OnInit {

  questionType: any;
  question: string = "";
  questionPiped: string = "";
  option1: any;
  option2: any;
  option3: any;
  option4: any;

  alertMessage: string = "";
  deleteButton: boolean = false;

  questionId: any;
  users: any;

  totalItems: number;
  page: number = 1;

  fillInexample: string = "Neil Armstrong {be}[was] born in 1930 and " +
    "{go}[went] to the moon in 1969. He {die}[died] in 2012. ";


  multipleAnswer: Object = {
    "option1": false,
    "option2": false,
    "option3": false,
    "option4": false,
  };

  booleanAnswer: Object = {
    "optionB1": false,
    "optionB2": false,
  };

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
    private questions: QuestionsService,
    private replacePipe : ReplacePipe
  ) {
  }

  ngOnInit() {

    this.showAllQuestion();
  }

  showAllQuestion() {
    this.questions.getQuestions()
      .toPromise()
      .then((data: any) => {
        this.questions.qns = data;
        this.totalItems = this.questions.qns.length;
      })
      .catch(err => {
        console.log(err);
      });
  }

  checkArray(event: any, tab: Object) {
    (event.checked) ? tab[event.id] = true : tab[event.id] = false;
  }

  private buttonChecked(event) {
    this.checkArray(event, this.multipleAnswer);
    this.checkArray(event, this.booleanAnswer);
  }

  questionTypeChoosen(event) {
    this.questionType = event.id;
  }

  submitOneAnswerCheck() {
    return (this.questionType === 'multipleQuestion') ?
      Object.keys(this.multipleAnswer)
        .filter(x => this.multipleAnswer[x]).length === 1 :
      (this.questionType === 'booleanQuestion') ?
        Object.keys(this.booleanAnswer)
          .filter(x => this.booleanAnswer[x]).length === 1 : undefined;
  }

  onCreateQuestion(event) {
    this.questionPiped = this.replacePipe.transform(this.question);
    console.log(this.questionPiped);
    console.log("toto");

    let questionCreated: Object;

    if (event.id === 'sumbitMultiple') {

      questionCreated = {
        "type": "multiple",
        "question": this.question,
        "answers": [
          {
            "option": this.option1,
            "isCorrect": this.multipleAnswer["option1"]
          },
          {
            "option": this.option2,
            "isCorrect": this.multipleAnswer["option2"]
          },
          {
            "option": this.option3,
            "isCorrect": this.multipleAnswer["option3"]
          },
          {
            "option": this.option4,
            "isCorrect": this.multipleAnswer["option4"]
          }
        ]
      };
      //console.log(questionCreated["answers"]);

    } else if (event.id === 'sumbitBoolean') {
      questionCreated = {

        "type": "boolean",
        "question": this.question,
        "answers": [
          {
            "option": this.option1,
            "isCorrect": this.booleanAnswer["optionB1"]
          },
          {
            "option": this.option2,
            "isCorrect": this.booleanAnswer["optionB2"]
          },
        ]
      };
    }

    this.questions.createQuestion(questionCreated)
      .toPromise()
      .then((data) => {
        this.showAllQuestion();
        this.alertMessage = `${data[0].message}`;
      })
      .catch(err => {
        this.alertMessage = "Something went wrong !";
        console.log(err);
      });

  }

  deleteClicked() {
    (this.deleteButton) ? this.deleteButton = false : this.deleteButton = true;
  }

  getQuestionId(event) {
    this.questionId = event.id;
  }

  onDeleteQuestion() {
    this.questions.deleteQuestion(this.questionId)
      .toPromise()
      .then((data) => {
        this.showAllQuestion();
        this.alertMessage = `${data["message"]}`;
      })
      .catch(err => {
        this.alertMessage = "Something went wrong !";
        console.log(err);
      });

  }

  trackByMethod(index: number, el: any): number {
    return el;
  }

  closeAlert() {
    this.alertMessage = "";
    Object.keys(this.multipleAnswer).forEach(x => this.multipleAnswer[x] = false);
    Object.keys(this.booleanAnswer).forEach(x => this.booleanAnswer[x] = false);
  }


}


/*
var string = "(1)[toto] went to the moon ______  in (2)[1969]";
string.match(/_{2,}/g);

var string = "(1)[toto] went to the moon ______  in (2)[1969]";
string.match(/\(\d+\)/g);
string.match(/\[.+?\]/g);

space = /_{2,}/g
"(1)[toto] went to the moon ______  in (2)[1969]".match(space)


t = string.match(/\(\d+\)/g);
tt = string.match(/\[.+?\]/g);
"(1)[toto] went to the moon in (2)[1969] and was born in (3)[usa]"
.replace(t[0] + tt[0], '(1) ___');


tab = {
        "type" : "boolean",
        "question" : "is 25 x 20 equal to 150 ?",
        "answerss": []

}



 */
