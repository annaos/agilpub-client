import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
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

  public findByVersion(documentVersion: DocumentVersion): Observable<DocumentVersion> {
    return this.http.get<DocumentVersion>(this.documentVersionUrl + documentVersion.id);
  }

  public findById(id: String): Observable<DocumentVersion> {
    return this.http.get<DocumentVersion>(this.documentVersionUrl + id);
  }

  public getFile(documentVersion: DocumentVersion): Observable<HttpResponse<Blob>> {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/pdf');

    return this.http.get(this.documentVersionUrl + documentVersion.id + '/file', {
      headers: headers,
      observe: 'response',
      responseType: 'blob'
    });
  }

  public save(documentVersion: DocumentVersion) {
    return this.http.post<Document>(this.documentVersionUrl, documentVersion);
  }
}
