import { HttpRequest } from '@angular/common/http';
import { MockRequest } from '@delon/mock';

const list = [];

const dataSet = [
 /* {
    key    : '0',
    itemText   : 'Edward King 0',
    itemValue1   : 'Edward King 0',
    itemValue2   : 'Edward King 0',
    itemValue3   : 'Edward King 0',
    parentItemId   : 'Edward King 0',
    orderNum    : '32',
    isOk: '1'
  },
  {
    key    : '1',
    itemText   : 'Edward King 1',
    itemValue1   : 'Edward King 1',
    itemValue2   : 'Edward King 1',
    itemValue3   : 'Edward King 1',
    parentItemId   : 'Edward King 1',
    orderNum    : '32',
    isOk: '1'
  }*/
];
for (let i = 1; i < 50; i += 1) {
  dataSet.push({
    key    : i+'',
    itemText   : `文件列表`,
    itemValue1   :  `文件列表`,
    itemValue2   : 'Edward King 0',
    itemValue3   : 'Edward King 0',
    parentItemId   : 'Edward King 0',
    orderNum    : i+'',
    isOk: '1'
  });
}
export const filelist = {
  '/filelist':dataSet,
};
