import { Component } from '@angular/core';
import {User} from "./model/user";
import {Router} from "@angular/router";
import {AuthenticationService} from "./service/authentication.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title: string;
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService, private http: HttpClient,
  ) {
    this.title = 'Agile Publikationsprozess';
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    //this.authenticationService.authenticate(undefined, undefined);

  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  login() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  register() {
    this.authenticationService.logout();
    this.router.navigate(['/register']);
  }
}
