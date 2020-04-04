import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

  title: string;
  currentRate: number;
  reviewText: string;
  readonly: boolean = true;
  deleteId: any;
  loggedInUser: any;
  updateId: any;

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router,
    private reviews: ReviewsService
  ) {
  }

  ngOnInit() {
    this.showReviews();
    this.loggedInUser = this.authService.userEmail;
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
            x.CreatedOn = new Date(x.CreatedOn);
            x.rating = Number(x.rating)
          });
        //tab.forEach(x => console.log(x.author, x.rating));
        this.reviews.rev = tab;
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
    //console.log(review);

    this.reviews.createReview(JSON.stringify(review))
      .toPromise()
      .then(() => {
        this.showReviews();
        this._flashMessagesService.show("Review added successfully !", {
          cssClass: "alert-success w-25",
          timeout: 2000
        });
      })
      .catch(err => {
        console.log(err);
        this._flashMessagesService.show("Something went wrong", {
          cssClass: "alert-danger w-25",
          timeout: 2000,
          navigate: `${this.router.navigate(['/reviews'])}`
        });
      });

  }

  modelTitle(event) {
    this.updateId = event.id;
    (event.name === 'createReview') ? this.title = 'Create a new review'
      : this.title = 'Update this review';
  }

  getDeleteId(event) {
    this.deleteId = event.title;
  }

  onDeleteReview() {
    this.reviews.deleteReview(this.authService.userId, this.deleteId)
      .toPromise()
      .then((data: any) => {
        this.showReviews();
        this._flashMessagesService.show(`${data.message}`, {
          cssClass: "alert-success w-25",
          timeout: 2000
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onUpdateReview(){
    const review = {
      rating: this.currentRate,
      reviewText: this.reviewText
    };
    this.reviews.updateReview(this.authService.userId, this.updateId,
      JSON.stringify(review))
      .toPromise()
      .then(() => {
        this.showReviews();
        this._flashMessagesService.show("Review updated successfully !", {
          cssClass: "alert-success w-25",
          timeout: 2000
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  choose(){
    if (this.title === 'Create a new review') {
      this.onReviewCreate();

    } else if (this.title === 'Update this review'){
      this.onUpdateReview();
    }
  }

}
