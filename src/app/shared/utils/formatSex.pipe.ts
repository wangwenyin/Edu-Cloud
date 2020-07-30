import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'formatSex' })

export class formatSexPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        switch (value) {
            case '0':
                return '女';
            case '1':
                return '男';
            default:
                return '未知';
        }
    }
}
