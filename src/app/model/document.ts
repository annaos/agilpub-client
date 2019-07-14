import {User} from "./user";
import {DocumentVersion} from "./document-version";
import {Tag} from "./tag";

export class Document {
  id: string;
  name: string;
  createdDate: Date;
  owner: User;
  versions: Array<DocumentVersion>;
  score: number;
  tags: Array<Tag>;

  constructor() {
    this.createdDate = new Date();
  }

  // not need - used as pipe getLastVersionPipe
  lastVersion?(): String {
    let last;
    for (let version of this.versions) {
      if (last == undefined || last.id < version.id) {
        last = version;
      }
    }
    return last;
  }

}
