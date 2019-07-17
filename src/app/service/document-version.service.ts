import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Document} from "../model/document";
import {DocumentVersion} from "../model/document-version";
import { APP_CONFIG, AppConfig } from '../app-config.module';

@Injectable({
  providedIn: 'root'
})
export class DocumentVersionService {

  private documentVersionUrl: string;
  private documentVersionsUrl: string;

  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.documentVersionUrl = this.config.apiEndpoint + '/documentversion/';
    this.documentVersionsUrl = this.config.apiEndpoint + '/documentversions/';
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
    return this.http.post(this.documentVersionUrl, documentVersion);
  }

}
