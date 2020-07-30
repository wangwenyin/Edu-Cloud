import { Component, OnInit, Input, Output, forwardRef, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ArrayService } from '../../utils/array.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzFormatEmitEvent } from 'ng-zorro-antd';
import { DictService } from './dict.service';
import { DictDetailService } from './dict-detail.service';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
    selector: 'ths-sys-dict',
    templateUrl: './dict.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DictComponent),
            multi: true
        }
    ]
})
export class DictComponent implements OnInit, ControlValueAccessor, OnChanges {

    /**
     * 显示组件类型
     * 0: 普通下拉选择
     * 1：树形选择
     */
    @Input() viewType: number | string = 0;

    /**
     * 设置nz-select的模式
     * 当 viewType=0 时有效
     * 可选值为: 'multiple' 丨 'tags' 丨 'default'
     */
    @Input() nzMode = 'default';

    /**
     * 设置nz-tree-select是否支持多选
     * 当 viewType=1 时有效
     */
    @Input() nzMultiple = false;

    /**
     * 是否显示搜索框
     */
    @Input() nzShowSearch = false;

    /**
     * 字典类型编码
     */
    @Input() dictNo: string;

    /**
     * 字典值映射属性
     */
    @Input() valueProperty = 'id';

    /**
     * 显示文本映射属性
     */
    @Input() labelProperty = 'itemText';

    /**
     * 父Id映射属性
     */
    @Input() parentId = 'parentId';

    /**
     * 下拉框样式
     */
    @Input() nzDropdownStyle = {width: '100%', height: '200px'};

    /**
     * 提示文本
     */
    @Input() nzPlaceHolder = '请选择';

    /**
     * 选项改变事件
     */
    @Output() ngModelChange = new EventEmitter();

    /**
     * 下拉选项加载成功后回调事件
     */
    @Output() afterOptionsLoad = new EventEmitter();

    /**
     * 字典选项列表
     */
    @Input() public optionList: any[] = [];

    @Output() optionListChange = new EventEmitter();

    @Input() nzDisabled = false;
    @Output() nzDisabledChange = new EventEmitter();

    private innerValue: any = '';
    nodes: any[] = [];

    constructor(
        private dictService: DictService,
        private dictDetailService: DictDetailService,
        private arrayService: ArrayService,
        private appSessionService: AppSessionService,
    ) {}

    ngOnInit(): void {
        if (this.dictNo) {
            const that = this;
            const projectId = this.appSessionService.appProjectId;
            this.dictService.findDictDetailBySysDictId(this.dictNo).subscribe(res => {
                if (res.body && res.body.length) {
                    this.optionList = res.body;
                    if (this.viewType === 1 || this.viewType === '1') {
                        this.nodes = this.arrayService.arrToTreeNode(res.body, {
                            parentIdMapName: this.parentId,
                            idMapName: this.valueProperty,
                            titleMapName: this.labelProperty,
                            cb: (item: any, parent: any, deep: number) => {
                                item.isLeaf = false;
                            }
                        });
                    }
                }
                this.afterOptionsLoad.emit();
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            if (propName === 'optionList') {
                console.log('op', this.optionList);
                const that = this;
                if (this.optionList && this.optionList.length) {
                    this.nodes = this.arrayService.arrToTreeNode(this.optionList, {
                        parentIdMapName: this.parentId,
                        idMapName: this.valueProperty,
                        titleMapName: this.labelProperty,
                        cb: (item: any, parent: any, deep: number) => {
                            // 如果字典是树形结构，则通过异步的方式加载其子节点
                            if (that.viewType === 1) {
                                item.isLeaf = false;
                            }
                        }
                    });
                }
            }
        }
    }

    modelChange() {
        this.ngModelChange.emit(this.value);
    }

    onExpandChange(e: NzFormatEmitEvent): void {
        if (e.node.getChildren().length === 0 && e.node.isExpanded) {
            const that = this;
            this.dictDetailService.findListByParentId(e.node.origin.id).subscribe((res) => {
                if (res.body && res.body.length) {
                    const children = this.arrayService.arrToTreeNode(res.body, {
                        parentIdMapName: this.parentId,
                        idMapName: this.valueProperty,
                        titleMapName: this.labelProperty,
                        cb: (item: any, parent: any, deep: number) => {
                            // 如果字典是树形结构，则通过异步的方式加载其子节点
                            if (that.viewType === 1) {
                                item.isLeaf = false;
                            }
                        }
                    });
                    e.node.addChildren(children);
                }
            });
        }
    }

    private onTouchedCallback: () => void = function() {};
    private onChangeCallback: (_: any) => void = function() {};

    get value(): any {
        return this.innerValue;
    }

    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
