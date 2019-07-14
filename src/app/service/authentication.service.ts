import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../model/user';
import {Router} from "@angular/router";
import { APP_CONFIG, AppConfig } from '../app-config.module';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  authenticated = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.authenticated = this.currentUserValue != undefined;
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string) {
    return this.http.get<any>(this.config.apiEndpoint + `users/` + username)
      .pipe(map(user => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.authenticated = true;
          this.currentUserSubject.next(user);
        } else {
          this.authenticated = false;
        }
        return user;
      }));
  }

  register(user: User) {
    return this.http.post<any>(this.config.apiEndpoint + `users`, { user })
      .pipe(result => {
        return this.login(user.username);
      });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.authenticated = false;
    this.currentUserSubject.next(null);
  }
}
