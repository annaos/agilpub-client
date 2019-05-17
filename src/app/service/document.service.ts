import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Document} from "../model/document";
import {User} from "../model/user";
import {DocumentVersion} from "../model/document-version";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private documentsUrl: string;
  private documentVersionsUrl: string;

  constructor(private http: HttpClient) {
    this.documentsUrl = 'http://localhost:8080/documents';
    this.documentVersionsUrl = 'http://localhost:8080/documentVersions';
  }

  public findAll(): Observable<Document[]> {
    return this.http.get<Document[]>(this.documentsUrl);
  }

  public findByOwner(user: User): Observable<Document[]> {
    return this.http.get<Document[]>(this.documentsUrl, {
      params: {
        userId: user.id,
      }});
  }

  public save(document: Document) {
    return this.http.post<Document>(this.documentsUrl, document);
  }
}
