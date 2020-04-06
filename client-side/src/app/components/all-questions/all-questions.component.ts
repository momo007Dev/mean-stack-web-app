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
  alertMessage : string;
  deleteButton: boolean = false;
  showButton: boolean = false;
  showTableView: boolean = false;
  questionId : any;
  answerArray: Object = {
    "option1" : false,
    "option2" : false,
    "option3" : false,
    "option4" : false,
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
        //console.log(data[0].answers.forEach(x => console.log(x.isCorrect)));
        this.questions.qns = data;
        this.questions.correctAnswerCount = 0;
        // this.question.qns.forEach(y => console.log(y.question,y.answers.forEach(x => console.log(x.option, x.isCorrect))));
      })
      .catch(err => {
        console.log(err);
      });
  }

  buttonChecked(event){
    (event.checked) ? this.answerArray[event.id] = true: this.answerArray[event.id] = false;
  }

  submitOneAnswerCheck(){
     return Object.keys(this.answerArray).filter(x => this.answerArray[x]).length === 1;
  }

  onCreateQuestion(){

    const questionCreated = {
      "question" : this.question,
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

    //console.log(questionCreated);
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

  deleteClicked(){
    (this.deleteButton) ? this.deleteButton = false : this.deleteButton = true;
  }
  // showButton

  showView(){
   (this.showButton) ? this.showButton = true : this.showTableView = false;
  }

  showTable(){
    !(this.showTableView) ? this.showTableView = true : this.showButton = true;
  }

  getQuestionId(event){
    this.questionId = event.id;
  }

  onDeleteQuestion(){
    //console.log(this.questionId);
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

  showQn(){

  }

  closeAlert(){
    this.alertMessage = "";
  }
}
