import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DocumentVersion} from "../model/document-version";
import {Comment} from "../model/comment";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private commentUrl: string;
  private commentsUrl: string;

  constructor(private http: HttpClient) {
    this.commentUrl = 'http://localhost:8080/comment/';
    this.commentsUrl = 'http://localhost:8080/comments/';
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
