import { Component, OnInit } from '@angular/core';
import { ControlWidget } from '@delon/form';

@Component({
  selector: 'sf-ueditor',
  template: `
  <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
    <div class="ant-form-item-control" style="z-index: 0">
    <ueditor
      [ngModel]="value"
      [config]="configs"
      [loadingTip]="loading"
      [delay]="delays"
      (ngModelChange)="change($event)">
    </ueditor>
  </div>
  </sf-item-wrap>
  `,
  preserveWhitespaces: false,
  styles: [`:host ueditor { line-height:normal; }`],
})
// tslint:disable-next-line:component-class-suffix
export class UeditorWidget extends ControlWidget implements OnInit {
  static readonly KEY = 'ueditor';

  configs: any;
  loading: string;
  delays: number;

  ngOnInit(): void {
    this.loading = this.ui.loading || '加载中……';
    this.configs = this.ui.config || {};
    this.delays = this.ui.delay || 300;
  }

  change(value: string) {
    if (this.ui.change) this.ui.change(value);
    this.setValue(value);
  }
}
