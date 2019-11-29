import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

@Pipe({ name: 'utcToLocalDate' })
export class UTCToLocalDatePipe implements PipeTransform {

  transform(input: string): any {

    if (!input) {
      return '';
    }

    return moment(input).utc(true).toDate();
  }
}
