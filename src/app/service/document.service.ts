import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Document} from "../model/document";
import {User} from "../model/user";
import { APP_CONFIG, AppConfig } from '../app-config.module';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private documentUrl: string;
  private documentsUrl: string;

  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.documentUrl = this.config.apiEndpoint + 'document/';
    this.documentsUrl = this.config.apiEndpoint + 'documents/';
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
