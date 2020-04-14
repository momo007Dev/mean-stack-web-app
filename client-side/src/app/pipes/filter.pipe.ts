import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, sname: string): any {
    console.log(value, sname);
    if (sname === "" ){
      return value;
    }
    const users : any[] = [];
    value.forEach(x => {
      let name : string = x.username;
      if(name.startsWith(sname)){
        users.push(x);
      }
    });
    return users;
  }

}
