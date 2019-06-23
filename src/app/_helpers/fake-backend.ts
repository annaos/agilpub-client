import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User } from '../model/user';
import {Document} from "../model/document";
import {DocumentVersion} from "../model/document-version";

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const users: User[] = [
      { id: '1', username: 'test', name: 'Test' },
      { id: '2', username: 'anna', name: 'Anna' }
    ];

    const documents: Document[] = [
      { id: '1', name: 'Homomorphic Signature', createdDate: new Date(), owner: users[0], versions: null },
      { id: '2', name: 'Algebra', createdDate: new Date(), owner: users[0], versions: null },
      { id: '3', name: 'Combinatorics', createdDate: new Date(), owner: users[0], versions: null }
    ];

    const documentVersions: DocumentVersion[] = [
      { id: '1', createdDate: new Date(), version: 1, filename: 'Version1', document: documents[0] },
      { id: '2', createdDate: new Date(), version: 1, filename: 'Version2', document: documents[0] },
      { id: '3', createdDate: new Date(), version: 1, filename: 'Version3', document: documents[0] }
    ];

    const documentVersions1: DocumentVersion[] = [
      { id: '4', createdDate: new Date(), version: 1, filename: 'Version1', document: documents[1] },
    ];
    const documentVersions2: DocumentVersion[] = [
      { id: '5', createdDate: new Date(), version: 1, filename: 'Version1', document: documents[2] },
    ];
    documents[0].versions = documentVersions;
    documents[1].versions = documentVersions1;
    documents[2].versions = documentVersions2;

    const authHeader = request.headers.get('Authorization');
    const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');

    // wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(() => {

      console.log('I am in FakeBackendInterceptor');

      // authenticate - public
      if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
        const user = users.find(x => x.username === request.body.username);
        if (!user) return error('Username or password is incorrect');
        return ok({
          id: user.id,
          username: user.username,
          firstName: user.name,
        });
      }

      // get all users
      if (request.url.endsWith('/users') && request.method === 'GET') {
        if (!isLoggedIn) return unauthorised();
        return ok(users);
      }

      // get all users
      if (request.url.endsWith('/documents') && request.method === 'GET') {
        if (!isLoggedIn) return unauthorised();
        if (request.params.has('documentId')){
          return ok(documents[0]);
        }
        return ok(documents);
      }

      // get all users
      if (request.url.endsWith('/documentVersions') && request.method === 'GET') {
        if (!isLoggedIn) return unauthorised();
        return ok(documentVersions);
      }

      // pass through any requests not handled above
      return next.handle(request);
    }))
    // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());

    // private helper functions

    function ok(body) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function unauthorised() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function error(message) {
      return throwError({ status: 400, error: { message } });
    }
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
