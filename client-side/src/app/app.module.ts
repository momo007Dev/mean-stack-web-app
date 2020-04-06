import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlashMessagesModule } from "angular2-flash-messages";
import { JwtModule } from '@auth0/angular-jwt';
import {ChartModule} from "angular2-chartjs";
import {JwtHelperService} from '@auth0/angular-jwt';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { NavbarComponent } from './components/navbar/navbar.component';
import {enableProdMode} from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import {ValidateService} from './services/validate.service';
import { AuthService } from "./services/auth.service";
import { QuestionsService } from "./services/questions.service";
import { ReviewsService } from "./services/reviews.service";
import { ChartsComponent } from './components/charts/charts.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { ResultsComponent } from './components/results/results.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { AddClassDirective } from './directives/add-class.directive';
import { AllQuestionsComponent } from './components/all-questions/all-questions.component';

const appRoutes : Routes = [
  {path: '', redirectTo : '/home', pathMatch: 'full'},
  { path: "home", component: HomeComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent},
  { path: "questions", component: QuestionsComponent},
  { path: "questions/all", component: AllQuestionsComponent},
  { path: "results", component: ResultsComponent},
  { path: "reviews", component: ReviewsComponent},
  { path: "users/all", component: AllUsersComponent},
  { path: "profile/:id", component: ProfileComponent},
  { path: "**", component: HomeComponent }
];

enableProdMode();


// noinspection AngularInvalidImportedOrDeclaredSymbol
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    ChartsComponent,
    QuestionsComponent,
    ResultsComponent,
    AllUsersComponent,
    FooterComponent,
    ReviewsComponent,
    AddClassDirective,
    AllQuestionsComponent,
  ],

  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot(),
    ChartModule,
  ],
  providers: [
    ValidateService,
    AuthService,
    QuestionsService,
    ReviewsService,
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
