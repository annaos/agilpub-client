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

  private documentVersionsUrl: string;

  constructor(private http: HttpClient) {
    this.documentVersionsUrl = 'http://localhost:8080/documentVersions';
  }

  public findByDocument(document: Document): Observable<DocumentVersion[]> {
    return this.http.get<DocumentVersion[]>(this.documentVersionsUrl, {
      params: {
        documentId: document.id,
      }});
  }

  public save(documentVersion: DocumentVersion) {
    return this.http.post<Document>(this.documentVersionsUrl, documentVersion);
  }
}
