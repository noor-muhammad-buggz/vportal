import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ifNullCovertToEmptyString' })
export class NullToStringPipe implements PipeTransform {

  transform(input: string): string {
    return (input == null)? '' : input;
  }
}
