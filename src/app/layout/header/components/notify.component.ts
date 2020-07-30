import { Component, OnInit, Inject } from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { NzMessageService } from 'ng-zorro-antd';
import { NoticeItem, NoticeIconList } from '@delon/abc';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModalHelper } from '@delon/theme';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

/**
 * 菜单通知
 */
@Component({
  selector: 'header-notify',
  template: `
  <notice-icon
    [data]="data"
    [count]="count"
    [loading]="loading"
    (select)="select($event)"
    (clear)="clear($event)"
    (popoverVisibleChange)="loadData()"></notice-icon>
  `,
  
})
export class HeaderNotifyComponent implements OnInit {


  ngOnInit(): void {
    
    const _this_ = this;
    _this_.loadData();
    setInterval(function() {
      console.log('每隔5min获取新的消息');
      _this_.updateCount();
    }, 1000 * 60 *5);

  }


  data: NoticeItem[] = [
    // {
    //   title: '通知',
    //   list: [],
    //   emptyText: '你已查看所有通知',
    //   emptyImage:
    //     'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
    //   clearText: '清空通知',
    // },
    {
      title: '消息',
      list: [],
      emptyText: '您已读完所有消息',
      emptyImage:
        'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
      clearText: '清空消息',
    },
    {
      title: '待办',
      list: [],
      emptyText: '你已完成所有待办',
      emptyImage:
        'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
      clearText: '清空待办',
    },
  ];
  count = 0;
  loading = false;

  constructor(
    private msg: NzMessageService,
    private http: HttpClient,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    public modal: ModalHelper,) {}

  updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data.slice();
    data.forEach(i => (i.list = []));

    notices.forEach(item => {
      const newItem = { ...item };
      if (newItem.datetime)
        newItem.datetime = distanceInWordsToNow(item.datetime, {
          locale: (window as any).__locale__,
        });
      if (newItem.extra && newItem.status) {
        newItem.color = {
          todo: undefined,
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newItem.status];
      }
      data.find(w => w.title === newItem.type).list.push(newItem);
    });
    return data;
  }

  updateCount(){
    const tokenData = this.tokenService.get();
    this.http.get('/thsadmin/api/sys-notifications?sort=sendTime,desc&size=1&isRead.equals=0&receiverId.equals='+ tokenData.entity_id, {observe: 'response'}).subscribe((res: HttpResponse<any[]>) => {
      this.count = parseInt(res.headers.get('x-total-count'));
    });
  }

  loadData() {
    
    const tokenData = this.tokenService.get();
    if (this.loading) return;
    this.loading = true;
    this.http.get('/thsadmin/api/sys-notifications?sort=sendTime,desc&size=1000&isRead.equals=0&receiverId.equals='+ tokenData.entity_id, {observe: 'response'}).subscribe((res: HttpResponse<any[]>) => {
      res.body.forEach(element => {
        element.title = element.senderName;
        element.description = element.summary ||  element.content.substr(0,50) + '......';
        element.datetime = element.sendTime;
        element.type = '消息';
        element.read = false;
        switch (element.priority) {
          case 2:
            element.extra = '优先';
            element.status = 'doing';
            if(element.isRead){
              element.avatar = './assets/tmp/img/message-read-2.png';
            }else{
              element.avatar = './assets/tmp/img/message-unread-2.png';
            }
            break;
          case 3:
            element.extra = '紧急';
            element.status = 'urgent';
            if(element.isRead){
              element.avatar = './assets/tmp/img/message-read-3.png';
            }else{
              element.avatar = './assets/tmp/img/message-unread-3.png';
            }
            break;
          case 1:
          default:
            element.extra = '普通';
            element.status = 'processing';
            if(element.isRead){
              element.avatar = './assets/tmp/img/message-read-1.png';
            }else{
              element.avatar = './assets/tmp/img/message-unread-1.png';
            }
            break;
        }
      });
      this.count = parseInt(res.headers.get('x-total-count'));
      this.data = this.updateNoticeData(res.body);
      this.loading = false;
    },(error) =>{
      this.loading = false;

    });
    // setTimeout(() => {
    //   this.data = this.updateNoticeData([
    //     // {
    //     //   id: '000000001',
    //     //   avatar:
    //     //     'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    //     //   title: '你收到了 14 份新周报',
    //     //   datetime: '2017-08-09',
    //     //   type: '通知',
    //     // },
    //     // {
    //     //   id: '000000002',
    //     //   avatar:
    //     //     'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    //     //   title: '你推荐的 曲妮妮 已通过第三轮面试',
    //     //   datetime: '2017-08-08',
    //     //   type: '通知',
    //     // },
    //     // {
    //     //   id: '000000003',
    //     //   avatar:
    //     //     'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
    //     //   title: '这种模板可以区分多种通知类型',
    //     //   datetime: '2017-08-07',
    //     //   read: true,
    //     //   type: '通知',
    //     // },
    //     // {
    //     //   id: '000000004',
    //     //   avatar:
    //     //     'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
    //     //   title: '左侧图标用于区分不同的类型',
    //     //   datetime: '2017-08-07',
    //     //   type: '通知',
    //     // },
    //     // {
    //     //   id: '000000005',
    //     //   avatar:
    //     //     'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    //     //   title: '内容不要超过两行字，超出时自动截断',
    //     //   datetime: '2017-08-07',
    //     //   type: '通知',
    //     // },
    //     {
    //       id: '000000006',
    //       avatar:
    //         'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    //       title: '曲丽丽 评论了你',
    //       description: '描述信息描述信息描述信息',
    //       datetime: '2017-08-07',
    //       type: '消息',
    //     },
    //     {
    //       id: '000000007',
    //       avatar:
    //         'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    //       title: '朱偏右 回复了你',
    //       description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
    //       datetime: '2017-08-07',
    //       type: '消息',
    //     },
    //     {
    //       id: '000000008',
    //       avatar:
    //         'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    //       title: '标题',
    //       description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
    //       datetime: '2017-08-07',
    //       type: '消息',
    //     },
    //     {
    //       id: '000000009',
    //       title: '任务名称',
    //       description: '任务需要在 2017-01-12 20:00 前启动',
    //       extra: '未开始',
    //       status: 'todo',
    //       type: '待办',
    //     },
    //     {
    //       id: '000000010',
    //       title: '第三方紧急代码变更',
    //       description:
    //         '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
    //       extra: '马上到期',
    //       status: 'urgent',
    //       type: '待办',
    //     },
    //     {
    //       id: '000000011',
    //       title: '信息安全考试',
    //       description: '指派竹尔于 2017-01-09 前完成更新并发布',
    //       extra: '已耗时 8 天',
    //       status: 'doing',
    //       type: '待办',
    //     },
    //     {
    //       id: '000000012',
    //       title: 'ABCD 版本发布',
    //       description:
    //         '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
    //       extra: '进行中',
    //       status: 'processing',
    //       type: '待办',
    //     },
    //   ]);

    //   this.loading = false;
    // }, 1000);
  }

  clear(type: string) {
    const list = this.data.filter(function(ele) {
      return ele.title === type
    })[0].list;
    switch (type) {
      case '消息':
        const ids = list.filter(function(value, index, arry){
          return value['read'] === false;
        }).map(function(value){
          return value['id'];
        }).join(',');
        if(ids === ""){
          this.msg.success(`已将所有 ${type} 标记为已读`);
          list.splice(0, list.length);
          this.count = 0;
          break;
        }
        this.http.put('/thsadmin/api/sys-notifications/read',  ids, {observe: 'response'}).subscribe((res: HttpResponse<any>) => {
          this.msg.success(`已将所有 ${type} 标记为已读`);
          list.splice(0, list.length);
          this.count = 0;
        });
        break;
    
      default:
        this.msg.success(`已清空所有 ${type}`);
        break;
    }

  }

  select(res: any) {

    switch (res.title) {
      case '消息':
        
        res.item.read = true;
        this.count --;
        switch (res.item.priority) {
          case 2:
            res.item.avatar = './assets/tmp/img/message-read-2.png';
            break;
          case 3:
            res.item.avatar = './assets/tmp/img/message-read-3.png';
            break;
          case 1:
          default:
            res.item.avatar = './assets/tmp/img/message-read-1.png';
            break;
        }
        break;
    
      default:
        break;
    }
  }
}
