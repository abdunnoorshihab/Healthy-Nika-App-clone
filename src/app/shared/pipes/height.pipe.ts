import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitAdd'
})
export class HeightConvertPipe implements PipeTransform {

  transform(value: string, separator: string): string {
    if (!value || !separator) {
      return value;
    }

    // Split the string based on the separator
    const splitValues = value.split(separator);

    if (splitValues.length === 1) {
      return `${splitValues[0]}'`;
    }
    // Check if both parts exist
    if (splitValues.length === 2) {
      // return `${splitValues[0]}\`${splitValues[1]}\``;
      return `${splitValues[0]}'${splitValues[1]}"`;// Format with backticks
    }



    return value; // Return original value if something goes wrong
  }

}
