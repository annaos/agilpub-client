import {Document} from "./document";
import {Comment} from "./comment";

export class DocumentVersion {
  id: string;
  createdDate: Date;
  version: number;
  filename: string;
  document: Document;
  comments?: Array<Comment>;

  constructor() {
    this.createdDate = new Date();
  }

}
