import {User} from "./user";
import {DocumentVersion} from "./document-version";

export class Comment {
  id: string;

  createdDate: Date;
  owner: User;
  version: DocumentVersion;
  text: String;
  selection: String;
  toText: String;

  constructor() {
    this.createdDate = new Date();
  }

}
