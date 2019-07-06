import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../model/user';
import {Router} from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  authenticated = false;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.authenticated = this.currentUserValue != undefined;
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string) {
    return this.http.get<any>(`http://localhost:8080/users/` + username)
      .pipe(map(user => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.authenticated = true;
          this.currentUserSubject.next(user);
          this.router.navigate(['/documents']);
        } else {
          this.authenticated = false;
        }
        return user;
      }));
  }

  register(user: User) {
    return this.http.post<any>(`http://localhost:8080/users`, { user })
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
