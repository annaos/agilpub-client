import { Pipe, PipeTransform } from '@angular/core';
import {DocumentVersion} from "../model/document-version";
import {Tag} from "../model/tag";

@Pipe({
  name: 'getLastVersion',
})
export class getLastVersionPipe implements PipeTransform {
  transform(versions: Array<DocumentVersion>) {
    let last = 0;
    for (let version of versions) {
      if (last < parseInt(version.id)) {
        last = parseInt(version.id);
      }
    }
    return last;
  }
}

@Pipe({
  name: 'getTags',
})
export class getTagsPipe implements PipeTransform {
  transform(tags: Array<Tag>) {
    let result: Array<String> = [];
    for (let tag of tags) {
      result.push(tag.name);
    }
    return result.join(', ');
  }
}
