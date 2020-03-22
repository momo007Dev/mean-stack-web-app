import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FlashMessagesService} from "angular2-flash-messages";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ReviewsService} from "../../services/reviews.service";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document,
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
    let tab : Array<any> = [];
    this.reviews.getAllReviews()
      .toPromise()
      .then((data: any) => {
        data.forEach(x => x.reviews.forEach(y => tab.push(y)));
        tab
          .sort((a,b) => Date.parse(a.CreatedOn) - Date.parse(b.CreatedOn))
          .forEach(x =>  x.CreatedOn = new Date(x.CreatedOn));
          //tab.forEach(x => console.log(x.author, (x.CreatedOn).toLocaleString('fr-BE')));
        this.reviews.rev = tab;
      })
      .catch(err => {
        console.log(err);
      });
  }

}
