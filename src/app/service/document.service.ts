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

  private documentUrl: string;
  private documentsUrl: string;
  private documentVersionsUrl: string;

  constructor(private http: HttpClient) {
    this.documentUrl = 'http://localhost:8080/document/';
    this.documentsUrl = 'http://localhost:8080/documents/';
    this.documentVersionsUrl = 'http://localhost:8080/documentVersions/';
  }

  public findAll(): Observable<Document[]> {
    return this.http.get<Document[]>(this.documentsUrl);
  }

  public findByOwner(user: User): Observable<Document[]> {
    return this.http.get<Document[]>(this.documentsUrl + user.id);
  }

  public findById(id: string): Observable<Document> {
    return this.http.get<Document>(this.documentUrl + id);
  }

  public save(document: Document) {
    return this.http.post<Document>(this.documentUrl, document);
  }
}
