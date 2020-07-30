import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'formatState' })

export class formatStatePipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        switch (value) {
            case '0':
                return "无效";
            case '1':
                return '有效';
            default:
                return '-';
        }
    }
}
