import {Pipe, PipeTransform} from '@angular/core';
import {UtilsService} from '../../services/core/utils.service';


@Pipe({
  name: 'years'
})
export class YearsPipe implements PipeTransform {

  constructor(protected utilsService: UtilsService) {
  }

  public transform(value: any): string | any {
    return this.utilsService.getYears(value);
  }


}
