import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Tag} from "../model/tag";
import { APP_CONFIG, AppConfig } from '../app-config.module';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private tagUrl: string;
  private tagsUrl: string;

  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.tagUrl = this.config.apiEndpoint + 'tag/';
    this.tagsUrl = this.config.apiEndpoint + 'tags/';
  }

  public saveTag(tag: Tag) {
    return this.http.post<Tag>(this.tagUrl, tag);
  }

  public deleteTag(tag: Tag) {
    return this.http.get<Tag>(this.tagUrl + tag.id);
  }

  public findAll() {
    return this.http.get<Tag[]>(this.tagsUrl);
  }

  public getDocuments(tag: Tag) {
    return this.http.get<Document[]>(this.tagsUrl + tag.id);
  }

}
