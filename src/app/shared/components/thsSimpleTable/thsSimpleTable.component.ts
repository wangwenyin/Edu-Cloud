// import { ThsCURDService } from "@shared/utils/ThsSimpleTable.util";
// import { SimpleTableComponent, SimpleTableData, SimpleTableColumn} from '@delon/abc';
// import { OnInit, ViewChild, Input } from '@angular/core';
// import { filter } from "rxjs/operators";
// import { NzMessageService, NzModalService } from "ng-zorro-antd";
// import { _HttpClient, ModalHelper } from '@delon/theme';
// import { Component } from '@angular/core';

// @Component({
//   selector: 'ths-simple-table',
//   template: './thsSimpleTable.component.html'
// })
// export class ThsSimpleTableComponent<T> implements OnInit{

//     @Input()  columns: SimpleTableColumn[];
//     @Input()  thsCURDService: ThsCURDService;

//     public page: number;
//     public size: number;
//     public total: number;

//     public list: T[] = [];
    
//     public totalCallNo: number = 0;
//     public selectedRows: SimpleTableData[] = [];

//     //HTML模板里面<simple-table>的选择器必须为st
//     @ViewChild('st') st: SimpleTableComponent;

//     constructor(
//         public msg: NzMessageService,
//         public http: _HttpClient,
//         public modal: ModalHelper,
//         public modalService: NzModalService,
//         public EditComponent,
//         public ViewComponent,
//         public queryParams
//       ) {
//         this.queryParams['sort'] = [];
//       }

//     ngOnInit() {
//         this.getDataList();
//     }



//     /**
//    * 获取数据列表
//    * @param {string} url
//    */
//   public getDataList(isReset ?: boolean){
//     let pipeParams = {};
//     const q = this.queryParams;
//     if(isReset === true){
//       this.page = 0;
//       Object.keys(q).forEach(function(key){
//         q[key].value = '';
//       });
//     }else{
//       Object.keys(q).forEach(function(key){
//         if(key == 'sort'){
//           pipeParams[key] = q[key];
//         }else if(q[key].value != ''){
//           pipeParams[key + '.' + q[key].type] = q[key].value;
//         }
//       });
//     };
//     pipeParams['page'] = this.page;
//     pipeParams['size'] = this.size;

//     this.thsCURDService.query(pipeParams)
//       .subscribe((res: any) => {
//         this.list = res.body;
//         this.total = res.headers.get('X-Total-Count');
//     });
//   }

//     /**
//    * 页码数量变动事件
//    * @param 
//    */
//   paginationChange(event){
//     this.page = event.pi-1;
//     this.size = event.ps;
//     this.getDataList();
//   }

//   /**
//    * 过滤器变动事件 支持多选过滤
//    * @param 
//    */
//   filterChange(event){
//     let i = 0;
//     let _value = [];
//     let _type = event.filterMultiple? 'in':'equals';
//     event.filters.forEach(element => {
//       if(element.checked){
//         _value[i++] = element.value;
//       }
//     });
//     this.queryParams[event.indexKey] = {
//       value : _value,
//       type : _type
//     };
//     this.getDataList();
//   }

//     /**
//    * 排序变动事件
//    * @param 
//    */
//   sortChange(event){
//     let array = this.queryParams['sort'];
//     let length = array.length;
//     let isInArray = false;
//     let value = null;
//     if(event.value == 'descend'){
//       value = 'desc';
//     }else if(event.value == 'ascend'){
//       value = 'asc';
//     }
//     for(let i = 0; i < length; i ++){
//       if(array[i].startsWith(event.column.indexKey)){
//         if(value == null){
//           array.splice(i,1);
//           isInArray = true;
//           break;
//         }else{
//           array[i] = event.column.indexKey + "," + value;
//           isInArray = true;
//           break;
//         }
//       }
//     }
//     if(value != null && !isInArray){
//       array.push(event.column.indexKey + "," + value);
//     }
//     //排序改变时，simpleTable会重置页码
//     this.page = 0;
//     this.getDataList();
//   }


//     /**
//    * 新增页面
//    */
//   add() {
//     this.modal
//       .static(this.EditComponent, { record: { id: null } })
// //      .pipe(filter(w => w === true))
//       .subscribe(() => {
//         this.getDataList();
//       });
//   }


//   /**
//    * 编辑页面
//    * @returns {NzMessageDataFilled}
//    */
//   edit() {
//     if(this.selectedRows.length>1)return this.msg.warning("只能选择一条数据再编辑！");
//     if(this.selectedRows.length<1)return this.msg.warning("请先选择一条数据再编辑！");
//     this.modal
//       .static(this.EditComponent, { record: this.selectedRows[0] })
//  //     .pipe(filter(w => w === true))
//       .subscribe(() => this.getDataList());
//   }

//   /**
//    * 查看页面
//    * @returns {NzMessageDataFilled}
//    */
//   view (){
//     if(this.selectedRows.length>1)return this.msg.warning("只能选择一条数据编辑！");
//     if(this.selectedRows.length<1)return this.msg.warning("请先选择一条数据再编辑！");
//     this.modal
//       .static(this.ViewComponent, { record: this.selectedRows[0] })
//       .pipe(filter(w => w === true))
//       .subscribe(() => this.st.reload());
//   }
//   /**
//    * 删除
//    */
//   remove(res:any){
//     this.modalService.confirm({
//       nzTitle     : '确认删除?',
//       nzContent   : '',
//       nzOkText    : '是',
//       nzOkType: 'danger',
//       nzOnOk: () => {
//         this.thsCURDService.delete(res.id)
//           .subscribe(() => {
//             this.getDataList();
//             this.st.clearCheck();
//           });
//       },
//       nzCancelText: '否',
//       nzOnCancel  : () => console.log('Cancel')
//     });
//   }

//   /**
//    * 批量删除
//    */
//   removeBatch(){
//     if(this.selectedRows.length<1)return this.msg.warning("请先选择您要删除的信息！");
//     this.modalService.confirm({
//       nzTitle     : '确认删除?',
//       nzContent   : '',
//       nzOkText    : '是',
//       nzOkType    : 'danger',
//       nzOnOk      : () => {
//         this.thsCURDService.delete(this.selectedRows.map(i => i.id))
//           .subscribe(() => {
//             this.getDataList();
//             this.st.clearCheck();
//           });},
//       nzCancelText: '否',
//       nzOnCancel  : () => console.log('Cancel')
//     });
//   }
  
//   /**
//    * 复选框事件
//    * @param {SimpleTableData[]} list
//    */
//   checkboxChange(list: SimpleTableData[]) {
//     this.selectedRows = list;
//     this.totalCallNo = this.selectedRows.reduce(
//       (total, cv) => total + cv.callNo,
//       0,
//     );
//   }

//   /**
//    * 行双击事件
//    * @param event
//    */
//   rowDblClick(event: any) {
    
//   } 

//    /**
//   * 行单击事件
//   * @param event
//   */
//  rowClick(event: any[]) {

//  }

//     /**
//   * radio变化时回调
//   * @param event
//   */
//  radioChange(event: any[]) {

// }

// }