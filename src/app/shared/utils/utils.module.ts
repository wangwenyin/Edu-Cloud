import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { formatStatePipe } from './formatState.pipe';

import { formatValuePipe } from "./formatValue.pipe";

import { formatBooleanPipe } from "./formatBoolean.pipe";

import { formatSexPipe } from "./formatSex.pipe";

import { ArrayService } from "./array.service";


@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        ArrayService
    ],
    declarations: [
        formatStatePipe,
        formatValuePipe,
        formatBooleanPipe,
        formatSexPipe
    ],
    exports: [
        formatStatePipe,
        formatValuePipe,
        formatBooleanPipe,
        formatSexPipe
    ]
})
export class UtilsModule { }
