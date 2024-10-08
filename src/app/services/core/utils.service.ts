import {DOCUMENT} from '@angular/common';
import {Inject, Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {

  }

  /**
   * UTILS DATE FUNCTIONS
   * getDateWithCurrentTime()
   * getDateString()
  */
  getDateWithCurrentTime(date: Date): Date {
    const _ = moment();
    const newDate = moment(date).add({ hours: _.hour(), minutes: _.minute() });
    return newDate.toDate();
  }

  getDateString(date: Date, format?: string): string {
    const fm = format ? format : 'YYYY-MM-DD';
    return moment(date).format(fm);
  }

  getYears(dateString: string) {
    return moment().diff(dateString, 'years')
  }

  addYearInDate(year: number) {
    return moment().subtract(year, 'years').format('YYYY-MM-DD');
  }

  // calculateDaysUntil(expireDate: string): number {
  //   // Convert expireDate string to Date object
  //   const expireDateObj = new Date(expireDate);
  //   // Get the current date
  //   const today = new Date();
  //   // Calculate the difference in milliseconds
  //   const differenceInMilliseconds = expireDateObj.getTime() - today.getTime();
  //   // Convert milliseconds to days
  //   return Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  // }

  calculateDaysUntil(expireDate: string): number {
    // Convert expireDate string to Date object
    const expireDateObj = new Date(expireDate);
    // Get the current date
    const today = new Date();
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = expireDateObj.getTime() - today.getTime();
    // Convert milliseconds to days
    const daysUntil = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    // Return 0 if the date has already passed
    return daysUntil < 0 ? 0 : daysUntil;
  }


  getDateAfterDays(dayCount: number, dateString: boolean, format?: string) {
    const date = new Date();
    date.setDate(date.getDate() + dayCount);

    if (dateString) {
      const fm = format ? format : 'YYYY-MM-DD';
      return moment(date).format(fm);
    } else {
      return date.toString();
    }
  }

  validateEmail(str: string) {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return !!str.match(mailFormat);
  }

  calculateRemainingTime(expireDate: string, expireTime: string): string {
    const expireDateTime = `${expireDate} ${expireTime}`;
    const expireDateTimeObj = new Date(expireDateTime);
    const currentDate = new Date();

    const timeDifference = expireDateTimeObj.getTime() - currentDate.getTime();

    if (timeDifference <= 0) {
      return "Match expired.";
    }

    const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    if (daysRemaining > 0) {
      return `${daysRemaining} days`;
    } else if (hoursRemaining > 0) {
      return `${hoursRemaining} hours`;
    } else {
      return `${minutesRemaining} minutes`;
    }
  }

  /**
   * GET RANDOM NUMBER FUNCTION
   * getRandomInt()
  */
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // REGEX SEARCH VARIABLE
  searchWithRegex = (collection: any[], term: string, opts: { caseSensitive: boolean, includedKeys: string[] }) => {
    const filterBy = () => {
      const searchTerms = (!opts.caseSensitive) ? new RegExp(term, 'i') : new RegExp(term)
      return (obj) => {
        for (const key of Object.keys(obj)) {
          if (searchTerms.test(obj[key]) &&
            opts.includedKeys.includes(key)) return true
        }
        return false
      }
    };
    return collection.filter(filterBy());
  }

  getImageName(originalName: string): string {
    const array = originalName.split('.');
    array.pop();
    return array.join('');
  }

  roundNumber(num: number): number{
    const integer = Math.floor(num);
    const fractional = num - integer;

    //Converting the fractional to the integer
    const frac2int = (fractional * 100) / 5;
    const fracCeil = Math.ceil(frac2int);

    //transforming inter into fractional
    const FracOut = (fracCeil * 5) / 100;
    const ans = integer + FracOut;

    return Number((Math.round(ans * 100) / 100).toFixed(2));
  }

  roundNumberString(num: number): string{
    const integer = Math.floor(num);
    const fractional = num - integer;

    //Converting the fractional to the integer
    const frac2int = (fractional * 100) / 5;
    const fracCeil = Math.ceil(frac2int);

    //transforming inter into fractional
    const FracOut = (fracCeil * 5) / 100;
    const ans = integer + FracOut;

    return (Math.round(ans * 100) / 100).toFixed(2);
  }


  getNextDateString(date: Date, day) {
    return moment(date).add(day,'days').toDate();
  }

  public blobToFile = (theBlob: Blob, fileName:string): File => {
    return  new File([theBlob], fileName, {
      type: theBlob.type,
      lastModified: new Date().getTime(),
    })
  }

  blobToFile1(blob: Blob, fileName: string): File {
    if (!blob || !blob.type) {
      throw new Error('Invalid blob data.');
    }
    return new File([blob], fileName, { type: blob.type });
  }
}
