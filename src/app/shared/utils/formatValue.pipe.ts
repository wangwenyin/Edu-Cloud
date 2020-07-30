import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'formatValue' })

export class formatValuePipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        debugger;
        switch (value) {
            case '0':
                return "否";
            case '1':
                return '是';
            default:
                return '-';
        }
    }
}
