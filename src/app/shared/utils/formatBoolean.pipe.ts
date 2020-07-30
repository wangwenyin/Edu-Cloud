import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'formatBoolean' })

export class formatBooleanPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        if (value) {
            return '有效';
        } else {
            return '无效';
        }
    }
}
