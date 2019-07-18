import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Document} from "../model/document";
import {User} from "../model/user";
import {Score} from "../model/score";
import { APP_CONFIG, AppConfig } from '../app-config.module';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  private scoreUrl: string;

  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.scoreUrl = this.config.apiEndpoint + 'score/';
  }

  public saveScore(score: Score) {
    return this.http.post<Score>(this.scoreUrl, score);
  }

  public getScore(user: User, document: Document) {
    return this.http.get<Score>(this.scoreUrl + user.id + '/' + document.id);
  }

}
