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
    let tab: Array<any> = [];
    this.reviews.getAllReviews()
      .toPromise()
      .then((data: any) => {
        this.loggedInUser = JSON.parse(localStorage.getItem('user')).userEmail;
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
        console.log(typeof this.authService.userId);
        console.log(typeof this.loggedInUser);
      })
      .catch(err => {
        console.log(err);
      });
  }

  onReviewSubmit() {
    const review = {
      rating: this.currentRate,
      reviewText: this.reviewText
    };
    //console.log(review);

    this.reviews.createReview(JSON.stringify(review))
      .toPromise()
      .then(() => {
        this.showReviews();
        console.log("toto");
        this._flashMessagesService.show("Review added successfully !", {
          cssClass: "alert-success",
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
          cssClass: "alert-success ",
          timeout: 2000
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

}
