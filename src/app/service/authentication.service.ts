import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../model/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  authenticated = false;//TODO use in login too

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
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
