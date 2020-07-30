export interface ThsSimpleTableComponent{
    queryParams : {};
}
export interface ThsCURDService{
    create : Function;
    update : Function;
    find : Function;
    query : Function;
    delete : Function;
}

export class ThsSimpleTableUtil {
    private _this;
    private queryParams;
    private service : ThsCURDService;
    private page;
    private size;

    constructor(_this : ThsSimpleTableComponent, service : ThsCURDService) {
        this._this = _this;
        this.queryParams = _this.queryParams;
        this.queryParams.sort = [];
        this.service = service;
    }

      /**
   * 获取数据列表
   * @param {string} url
   */
  public getDataList(isReset ?: boolean){
    let pipeParams = {};
    const q = this.queryParams;
    if(isReset === true){
      this.page = 0;
      Object.keys(q).forEach(function(key){
        q[key].value = '';
      });
    }else{
      Object.keys(q).forEach(function(key){
        if(key == 'sort'){
          pipeParams[key] = q[key];
        }else if(q[key].value != ''){
          pipeParams[key + '.' + q[key].type] = q[key].value;
        }
      });
    };
    pipeParams['page'] = this.page;
    pipeParams['size'] = this.size;

    this.service.query(pipeParams)
      .subscribe((res: any) => {
        this._this.list = res.body;
        this._this.total = res.headers.get('X-Total-Count');
    });
  }

    /**
   * 页码数量变动事件
   * @param 
   */
  private paginationChange(event){
    this.page = event.pi-1;
    this.size = event.ps;
    this.getDataList();
  }
  /**
   * 过滤器变动事件 支持多选过滤
   * @param 
   */
  filterChange(event){
    let i = 0;
    let _value = [];
    let _type = event.filterMultiple? 'in':'equals';
    event.filters.forEach(element => {
      if(element.checked){
        _value[i++] = element.value;
      }
    });
    this.queryParams[event.indexKey] = {
      value : _value,
      type : _type
    };
    this.getDataList();
  }
    /**
   * 排序变动事件
   * @param 
   */
  sortChange(event){
    let array = this._this.queryParams['sort'];
    let length = array.length;
    let isInArray = false;
    let value = null;
    if(event.value == 'descend'){
      value = 'desc';
    }else if(event.value == 'ascend'){
      value = 'asc';
    }
    for(let i = 0; i < length; i ++){
      if(array[i].startsWith(event.column.indexKey)){
        if(value == null){
          array.splice(i,1);
          isInArray = true;
          break;
        }else{
          array[i] = event.column.indexKey + "," + value;
          isInArray = true;
          break;
        }
      }
    }
    if(value != null && !isInArray){
      array.push(event.column.indexKey + "," + value);
    }
    //排序改变时，simpleTable会重置页码
    this.page = 0;
    this.getDataList();
  }
}