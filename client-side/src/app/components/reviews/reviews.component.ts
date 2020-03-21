import {Component, OnInit} from '@angular/core';
import {FlashMessagesService} from "angular2-flash-messages";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ReviewsService} from "../../services/reviews.service";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
    private reviews: ReviewsService
  ) {
  }

  ngOnInit() {
    this.showReviews();
  }

  showReviews() {
    this.reviews.getAllReviews()
      .toPromise()
      .then((data: any) => {
        console.log(data);
        this.reviews.rev = data;
        // this.question.qns.forEach(y => console.log(y.question,y.answers.forEach(x => console.log(x.option, x.isCorrect))));
      })
      .catch(err => {
        console.log(err);
      });
  }

}
