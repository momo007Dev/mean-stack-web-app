import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  qns: any[];
  seconds: number;
  timer;
  qnProgress: number;
  correctAnswerCount: number = 0;

  constructor(private _http: HttpClient) { }

  displayTimeElapsed() {
    return Math.floor(this.seconds / 3600) + ':' + Math.floor(this.seconds / 60)
      + ':' + Math.floor(this.seconds % 60);
  }

  getQuestions() {
    return this._http.get('/server/api/questions', {headers});
  }

  createQuestion(question : any) {
    return this._http.post('/server/api/questions', question,{headers});
  }

  deleteQuestion(questionId: any){
    // `/server/api/user/${userEmail}/reviews/${reviewId}`
    return this._http.delete(`/server/api/questions/${questionId}`, {headers});
  }

}
