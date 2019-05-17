import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../model/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  authenticated = false;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get admin(): boolean {
    return this.currentUserSubject.value.admin;
  }

  login(username: string, password: string) {
    const headers = new HttpHeaders({authorization : 'Basic ' + btoa(username + ':' + password)});

    console.log('I am in login()');
    return this.http.post<any>(`http://localhost:8080/users/authenticate`, { username, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        return user;
      }));



  }

  authenticate(username: string, password: string, callback) {
    const headers = new HttpHeaders({authorization : 'Basic ' + btoa(username + ':' + password)});

    console.log('I am in authenticate()');

    return this.http.get('http://localhost:8080/users/authenticate', {headers: headers})
      .subscribe(response => {
        if (response['name']) {
          this.authenticated = true;
          localStorage.setItem('currentUser', JSON.stringify(response));
          //this.currentUserSubject.next(response);
          return response;
        } else {
          this.authenticated = false;
        }
      });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
