import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, sname: string): any {
    if (sname === "" ){
      return value;
    }
    const users : any[] = [];
    value.forEach(x => {
      let username : string = x.username;
      if(username.startsWith(sname.toLocaleLowerCase())){
        users.push(x);
      }
    });
    return users;
  }

}
