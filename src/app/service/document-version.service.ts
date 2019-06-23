import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Document} from "../model/document";
import {User} from "../model/user";
import {DocumentVersion} from "../model/document-version";

@Injectable({
  providedIn: 'root'
})
export class DocumentVersionService {

  private documentVersionUrl: string;
  private documentVersionsUrl: string;

  constructor(private http: HttpClient) {
    this.documentVersionUrl = 'http://localhost:8080/documentversion/';
    this.documentVersionsUrl = 'http://localhost:8080/documentversions/';
  }

  public findByDocument(document: Document): Observable<DocumentVersion[]> {
    return this.http.get<DocumentVersion[]>(this.documentVersionsUrl + document.id);
  }

  public findById(documentVersion: DocumentVersion): Observable<DocumentVersion> {
    return this.http.get<DocumentVersion>(this.documentVersionUrl + documentVersion.id);
  }

  public getFile(documentVersion: DocumentVersion): Observable<File> {
    return this.http.get<File>(this.documentVersionUrl + documentVersion.id + '/filename');
  }

  public save(documentVersion: DocumentVersion) {
    return this.http.post<Document>(this.documentVersionUrl, documentVersion);
  }
}
