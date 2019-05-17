import {Document} from "./document";

export class DocumentVersion {
  id: string;
  createdDate: Date;
  version: number;
  file: string;
  document: Document
}
