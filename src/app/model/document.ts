import {User} from "./user";
import {DocumentVersion} from "./document-version";

export class Document {
  id: string;
  name: string;
  createdDate: Date;
  owner: User;
  versions: Array<DocumentVersion>;
}
