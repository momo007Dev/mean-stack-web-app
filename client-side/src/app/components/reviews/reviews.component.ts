import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FlashMessagesService} from "angular2-flash-messages";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ReviewsService} from "../../services/reviews.service";
import { timer } from 'rxjs';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  title: string;
  currentRate: number;
  reviewText: string;

  readonly: boolean = true;
  deleteId: any;
  loggedInUser: any;

  loggedInUserRole: any;
  updateId: any;
  date: any;

  reviewAuthor: any;

  totalItems : number;
  page:number = 1;

  alertMessage: string = "";

  constructor(
    private _flashMessagesService: FlashMessagesService,
    public authService: AuthService,
    private router: Router,
    public reviews: ReviewsService
  ) {
  }

  ngOnInit() {
    this.loggedInUser = this.authService.userEmail;
    this.loggedInUserRole = this.authService.role;
    setInterval(() => {
      this.showReviews();
    }, 1000);
  }

  showReviews() {
    let tab: Array<any> = [];
    this.reviews.getAllReviews()
      .toPromise()
      .then((data: any) => {
        this.reviews.userId = data._id;
        data.forEach(x => x.reviews.forEach(y => tab.push(y)));
        tab
          .sort((a, b) => Date.parse(b.CreatedOn) - Date.parse(a.CreatedOn))
          .forEach(x => {
            x.rating = Number(x.rating);
            x.CreatedOn = this.reviews
              .formatDate(this.reviews.getDate() - new Date(x.CreatedOn).getTime());

          });
        this.reviews.rev = tab;
        this.totalItems = this.reviews.rev.length;
      })
      .catch(err => {
        console.log(err);
      });
  }

  onReviewCreate() {
    const review = {
      rating: this.currentRate,
      reviewText: this.reviewText
    };

    this.reviews.createReview(JSON.stringify(review))
      .toPromise()
      .then(() => {
        this.showReviews();
        this.alertMessage = "Review added successfully !";
      })
      .catch(err => {
        this.alertMessage = "Something went wrong !";
        console.log(err);
      });

  }

  chooseModalTitle(event) {
    this.updateId = event.id;
    this.reviewAuthor = event.title;
    (event.name === 'createReview') ? this.title = 'Create a new review'
      : this.title = 'Update this review';
  }

  getDeleteId(event) {
    this.reviewAuthor = event.id;
    this.deleteId = event.title;
  }

  onDeleteReview() {
    this.reviews.deleteReview(this.reviewAuthor, this.deleteId)
      .toPromise()
      .then((data: any) => {
        this.showReviews();
        this.alertMessage = `${data.message}`;
      })
      .catch(err => {
        this.alertMessage = "Something went wrong !";
        console.log(err);
      });
  }

  onUpdateReview() {
    const review = {
      rating: this.currentRate,
      reviewText: this.reviewText
    };
    this.reviews.updateReview(this.reviewAuthor, this.updateId,
      JSON.stringify(review))
      .toPromise()
      .then(() => {
        this.showReviews();
        this.alertMessage = "Review updated successfully !";
      })
      .catch(err => {
        this.alertMessage = "Something went wrong !";
        console.log(err);
      });
  }

  choose() {
    if (this.title === 'Create a new review') {
      this.onReviewCreate();

    } else if (this.title === 'Update this review') {
      this.onUpdateReview();
    }
  }

  closeAlert() {
    this.alertMessage = "";
  }

}
