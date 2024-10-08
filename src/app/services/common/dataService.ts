import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  // Example function to transform data
  transformData(data: any): { ageOptions: string[], ethnicityOptions: string[], professionOptions: string[] } {

    // Extracting and mapping ethnicity options from the data
    const ageOptions = Object.keys(data)
      .filter(key => key.includes('age'))
      .flatMap(key => data[key])
      .map(item => item.name);

    const ethnicityOptions = Object.keys(data)
      .filter(key => key.includes('ethnicity'))
      .flatMap(key => data[key])
      .map(item => item.name);

    const professionOptions = Object.keys(data)
      .filter(key => key.includes('profession'))
      .flatMap(key => data[key])
      .map(item => item.name);

    return { ageOptions, ethnicityOptions , professionOptions };
  }
}
