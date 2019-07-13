import {User} from "./user";
import {Document} from "./document";

export class Score {
  owner: User;
  document: Document;
  score: number;
}
