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

    //let t = value.match(/\(\d+\)/g);
    let tt = value.match(/{.+?}/g);
    let ttt = value.match(/\[.+?]/g);
    if (tt.length === 0) {
      return value;
    }

    tt.forEach((x, i) => {
      (i === 0) ?
        s = value.replace( tt[0] + ttt[0],
          '(' + (i + 1) + ')' + tt[0] + '___') :
        s = s.replace( tt[i] + ttt[i],
          '(' + (i + 1) + ')' + tt[i] + '___');
    });

    return s;
  }

}
