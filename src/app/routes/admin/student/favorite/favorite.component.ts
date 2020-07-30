import { Component, OnInit, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { UserService } from '../../user.service';
import {  DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpAddressService } from '@shared/session/http-address.service';
@Component({
  selector: 'app-my-course-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.less']
})
export class FavoriteComponent implements OnInit {
  userId='';//用户id
  course='';//课程名称
  imgPrefix = ''; // 图片前缀
   
  //最新
  currentPageIndex_new = 1;
  public page_new = 0;
  public size_new= 9;
  public total_new: number;
  dataList_new: any[] = [];
  queryParams_new = {
    // sort固定
     sort: ['ecf.favorite_time,desc']
  };

  //最火
  currentPageIndex_popular = 1;
  public page_popular = 0;
  public size_popular= 9;
  public total_popular: number;
  dataList_popular: any[] = [];
  queryParams_popular = {
    // sort固定
     sort: ['ec.favorite_count,desc']
  };
 

  constructor(
    private router: Router,
    public userService: UserService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    httpAddressService: HttpAddressService
    ) {
      this.imgPrefix = httpAddressService.apiGateway + httpAddressService.systemServe + '/sys-files/preview/';
      this.userId = this.tokenService.get().id;
    }

  ngOnInit() {
    this.getDataList_new();
  }

  nextPage() {
    this.router.navigateByUrl('/admin/teacher/my-course/class');
  }

 /**
  * 获取最新收藏列表
  * @param {string} url
  */
 public getDataList_new(isReset?: boolean) {
  const copyParams = {};
  const q = this.queryParams_new;
  if (isReset === true) {
    this.page_new = 0;
    Object.keys(q).forEach(function (key) {
      q[key] = '';
    });
  } else {
    Object.keys(q).forEach(function (key) {
      if (q[key] !== '' &&　q[key] !== null) {
        copyParams[key] = q[key];
      }
    });
  }
  copyParams['page'] = this.page_new;
  copyParams['size'] = this.size_new;
 this.userService.queryFavoriteCourse(this.userId,this.course, copyParams)
    .subscribe((res: any) => {
    this.dataList_new = res.body.data;
    this.total_new = res.headers.get('X-Total-Count');
    });
}

 /**
  * 获取最火收藏列表
  * @param {string} url
  */
 public getDataList_popular(isReset?: boolean) {
  const copyParams = {};
  const q = this.queryParams_popular;
  if (isReset === true) {
    this.page_popular = 0;
    Object.keys(q).forEach(function (key) {
      q[key] = '';
    });
  } else {
    Object.keys(q).forEach(function (key) {
      if (q[key] !== '' &&　q[key] !== null) {
        copyParams[key] = q[key];
      }
    });
  }
  copyParams['page'] = this.page_popular;
  copyParams['size'] = this.size_popular;
 this.userService.queryFavoriteCourse(this.userId,this.course ,copyParams)
    .subscribe((res: any) => {
    this.dataList_popular = res.body.data;
    this.total_popular = res.headers.get('X-Total-Count');
    });
}

}
