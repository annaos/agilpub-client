import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Document} from "../model/document";
import {User} from "../model/user";
import {DocumentVersion} from "../model/document-version";
import {Score} from "../model/score";
import { APP_CONFIG, AppConfig } from '../app-config.module';

@Injectable({
  providedIn: 'root'
})
export class DocumentVersionService {

  private documentVersionUrl: string;
  private documentVersionsUrl: string;
  private scoreUrl: string;

  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.documentVersionUrl = this.config.apiEndpoint + '/documentversion/';
    this.documentVersionsUrl = this.config.apiEndpoint + '/documentversions/';
    this.scoreUrl = this.config.apiEndpoint + '/score/';
  }

  public getFileUploadUrl() {
    return this.config.apiEndpoint + '/api/files';
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

  public saveScore(score: Score) {
    return this.http.post<Score>(this.scoreUrl, score);
  }

  public getScore(user: User, document: Document) {
    return this.http.get<Score>(this.scoreUrl + user.id + '/' + document.id);
  }

}
