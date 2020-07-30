import { OnInit, Component, Input, forwardRef,Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges, AfterViewInit, AfterContentInit, AfterViewChecked } from "@angular/core";
import {
    ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS,
    AbstractControl, ValidatorFn, ValidationErrors, FormControl
} from '@angular/forms';

export const EXE_MONEY_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ThsMonenyInputComponent),
    multi: true
};

// export const validateCounterRange: ValidatorFn = (control: AbstractControl): 
//   ValidationErrors => {
//     return (control.value > 10 || control.value < 0) ?
//         { 'rangeError': { current: control.value, max: 10, min: 0 } } : null;
// };

// export const EXE_MONEY_VALIDATOR = {
//     provide: NG_VALIDATORS,
//     useValue: validateCounterRange,
//     multi: true
// };
@Component({
    selector: 'ths-money-input',
    templateUrl: './moneyInput.component.html',
    styles: [`
        /* Hide HTML5 Up and Down arrows. */
        input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        
        input[type="number"] {
            -moz-appearance: textfield;
        }
    `],
    providers: [EXE_MONEY_VALUE_ACCESSOR]
  })
  export class ThsMonenyInputComponent implements OnChanges,AfterViewChecked {




    @Input() placeholder: string = '请输入金额';

    @Input() readOnly: boolean = false;

    /**
     * 金额单位: 默认元
     */
    @Input() unit: '元' | '万元' = '元';

    @Input() _money: string = null;

    get money() {
        return this._money;
    }

    set money(value: string) {
        this._money = value;
        this.propagateChange(this._money);
    }

    propagateChange = (_: any) => {
    };

    writeValue(value: any) {
        if (value) {
            this._money = value;
            this.formatMoney(value);
        }
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any) { }
    /**
     * 金额数值 用法[(moeny)]
     */
    // money:string = null;
    // @Output() moneyChange = new EventEmitter<any>();

    /**
     * 大写金额
     */
    amount:string = '零元整';


    constructor(private cdr: ChangeDetectorRef){

    }

    
    ngAfterViewChecked(): void {
        // this.formatMoney();
    }


    // 失去焦点后自动去除小数点
    updateMoney(){
        if(!this.money){
            return ;
        }
        this.money += '';
        if(this.money.length > 0 && this.money.charAt(this.money.length-1) == '.'){
            this.money = this.money.substr(0, this.money.length-1);
            this.formatMoney();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['money'] && changes['money'].currentValue){
            this.formatMoney();
        }
    }


    formatMoney(value?){
        var str;

        if(value){
            str = value + '';
        }else{
            str = this.money + '';
        }
        if(!str || str.length == 0){
            this.amount = '零元整';
            return;
        }
        //正则替换，保留数字和小数点
        str = str.replace(/[^\d^\.]+/g,'');
        //如果第一位是0，第二位不是点，去掉0
        if (str.length > 1 && str.charAt(0) == "0" && str.charAt(1) != ".") {
            str = str.substr(1, str.length-1);
        }
        //第一位不能是.
        if (str.charAt(0) == ".") {
            str = "0.";
        }
        //限制只能输入一个小数点
        if(str.charAt(str.length-1) == "."){
            if(str.indexOf(".") > -1 && str.indexOf(".") < str.length-1){
                str = str.substr(0, str.length - 1);
            }
        }
        if(this.unit == '元'){
            //元 保留小数点后两位
            str = str.replace(/(\d+.\d\d)(\d*)/, "$1");
        }else{
            //万元 保留小数点后四位
            str = str.replace(/(\d+.\d\d\d\d)(\d*)/, "$1");
        }
        // console.log(this.money);
        if(value){
            value = str;
        }else{
            this.money = str;
        }
        if(this.unit == '万元'){
            str = Number.parseFloat(str) * 10000;
        }
        this.amount = this.digitUppercase(str);
        this.cdr.detectChanges();
    }


    /**
     * 来源： https://gist.github.com/tonyc726/00c829a54a40cf80409f
     * @param n 
     */
    digitUppercase(n) {
        var fraction = ['角', '分'];
        var digit = [
            '零', '壹', '贰', '叁', '肆',
            '伍', '陆', '柒', '捌', '玖'
        ];
        var unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟']
        ];
        var head = n < 0 ? '欠' : '';
        n = Math.abs(n);
        var s = '';
        for (var i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(this.shiftRight(n,1+i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);
        for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(this.shiftLeft(n, 1));
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元')
            .replace(/(零.)+/g, '零')
            .replace(/^整$/, '零元整');
    }
    
    // 向右移位
    shiftRight(number, digit){
        digit = parseInt(digit, 10);
        var value = number.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + digit) : digit))
    }
    // 向左移位
    shiftLeft(number, digit){
        digit = parseInt(digit, 10);
        var value = number.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] - digit) : -digit))
    }

  }