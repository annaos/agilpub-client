import {Document} from "./document";

export class DocumentVersion {
  id: string;
  createdDate: Date;
  version: number;
  filename: string;
  document: Document;

  constructor() {
    this.createdDate = new Date();
  }

}
