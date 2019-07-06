import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe, registerLocaleData} from '@angular/common';
import localeDe from "@angular/common/locales/de";
import {DocumentVersion} from "../model/document-version";

@Pipe({
  name: 'getLastVersion',
})
export class getLastVersionPipe implements PipeTransform {
  transform(versions) {
    let last = 0;
    for (let version of versions) {
      if (last < version.id) {
        last = version.id;
      }
    }
    return last;
  }
}
