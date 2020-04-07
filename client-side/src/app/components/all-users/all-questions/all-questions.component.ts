import {Component, OnInit} from '@angular/core';
import {FlashMessagesService} from "angular2-flash-messages";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {QuestionsService} from "../../../services/questions.service";

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

  alertMessage: string;
  deleteButton: boolean = false;
  switchToAllQuestions: boolean = false;
  switchToUserTable: boolean = false;

  sortUsername: boolean = false;
  sortScore: boolean = false;
  sortEmail: boolean = false;

  questionId: any;
  users: any;

  totalItems : number;
  page:number = 1;
  test: any;


  answerArray: Object = {
    "option1": false,
    "option2": false,
    "option3": false,
    "option4": false,
  };

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
        this.questions.qns = data;
        this.totalItems = this.questions.qns.length;
      })
      .catch(err => {
        console.log(err);
      });
  }

  buttonChecked(event) {
    (event.checked) ? this.answerArray[event.id] = true : this.answerArray[event.id] = false;
  }

  submitOneAnswerCheck() {
    return Object.keys(this.answerArray).filter(x => this.answerArray[x]).length === 1;
  }

  onCreateQuestion() {

    const questionCreated = {
      "question": this.question,
      "answers": [
        {
          "option": this.option1,
          "isCorrect": this.answerArray["option1"]
        },
        {
          "option": this.option2,
          "isCorrect": this.answerArray["option2"]
        },
        {
          "option": this.option3,
          "isCorrect": this.answerArray["option3"]
        },
        {
          "option": this.option4,
          "isCorrect": this.answerArray["option4"]
        }
      ]
    };

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

  showView() {
    (this.switchToAllQuestions) ? this.switchToAllQuestions = true :
      this.switchToUserTable = false;
  }

  showTable() {
    !(this.switchToUserTable) ? this.switchToUserTable = true :
      this.switchToAllQuestions = true;
    this.showUsersInTable();
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

  showUsersInTable() {
    this.authService.getAllProfiles()
      .toPromise()
      .then((data: any) => {
        this.users = data.filter(x => x.username !== 'admin' && x.username !== 'teacher');
      })
      .catch(err => {
        console.log(err);
      });
  }

  sortByUsername(event) {
    if (event.id === 'username'){
      if (this.sortUsername) {
        this.sortUsername = false;
        this.users.sort((a, b) => (a.username < b.username) ? 1
          : (a.username > b.username) ? -1 : 0);
      } else {
        this.sortUsername = true;
        this.users.sort((a, b) => (a.username > b.username) ? 1
          : (a.username < b.username) ? -1 : 0);
      }
    } else if (event.id === 'score'){
      if (this.sortScore) {
        this.sortScore = false;
        this.users.sort((a, b) => (a.score - b.score));
      } else {
        this.sortScore = true;
        this.users.sort((a, b) => (b.score - a.score));
      }

    } else if (event.id === 'email'){
      if (this.sortEmail) {
        this.sortEmail = false;
        this.users.sort((a, b) => (a.email < b.email) ? 1
          : (a.email > b.email) ? -1 : 0);
      } else {
        this.sortEmail = true;
        this.users.sort((a, b) => (a.email > b.email) ? 1
          : (a.email < b.email) ? -1 : 0);
      }
    }
  }

  trackByMethod(index:number, el:any): number {
    return el;
  }



  closeAlert() {
    this.alertMessage = "";
  }
}
