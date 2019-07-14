import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DocumentVersion} from "../model/document-version";
import {Comment} from "../model/comment";
import {APP_CONFIG, AppConfig} from "../app-config.module";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private commentUrl: string;
  private commentsUrl: string;

  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.commentUrl = this.config.apiEndpoint + 'comment/';
    this.commentsUrl = this.config.apiEndpoint + '/comments/';
  }

  public findAll(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentsUrl);
  }

  public findByVersion(version: DocumentVersion): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentsUrl + version.id);
  }

  public findById(id: string): Observable<Comment> {
    return this.http.get<Comment>(this.commentUrl + id);
  }

  public save(comment: Comment) {
    return this.http.post<Comment>(this.commentUrl, comment);
  }

  public delete(id: String) {
    return this.http.get<Comment>(this.commentUrl + 'delete/' + id);
  }
}
