import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe, registerLocaleData} from '@angular/common';
import localeDe from "@angular/common/locales/de";

@Pipe({
  name: 'createdDateFormat',
})
export class createdDateFormatPipe implements PipeTransform {
  transform(value: Date) {
    registerLocaleData(localeDe);
    let datePipe = new DatePipe("de-DE");
    return datePipe.transform(value, 'dd.MM.yyyy \'um\' HH:mm:ss');
  }
}
