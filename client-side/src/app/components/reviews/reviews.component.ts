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

  currentRate: number;
  reviewText: string;
  readonly: boolean = true;

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
          `${this.router.navigate(['/reviews'])}`;
        }
      )
      .catch(err => {
        console.log(err);
        this._flashMessagesService.show("Something went wrong", {
          cssClass: "alert-danger w-25",
          timeout: 2000,
          navigate: `${this.router.navigate(['/reviews'])}`
        });
      });

  }

}
