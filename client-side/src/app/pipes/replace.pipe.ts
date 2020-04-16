import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: any, sname: string): any {

    if (sname === "") {
      return value;
    }

    let s: string = "";
    let t = value.match(/\(\d+\)/g);
    if (t.length === 0) {
      return value;
    }
    let tt = value.match(/\[.+?]/g);

    t.forEach((x, i) => {
      (i === 0) ?
        s = value.replace(t[0] + tt[0], '(' + (i + 1) + ')' + '___')
        :
        s = s.replace(t[i] + tt[i], '(' + (i + 1) + ')' + '___');
    });

    return s;
  }

}
