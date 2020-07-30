import { MockRequest, MockStatusError } from '@delon/mock';
// TIPS: mockjs 一些优化细节见：http://ng-alain.com/docs/mock
// import * as Mock from 'mockjs';

const curentuserinfo={
  userName:'Admin',
  entityName:'Admin',
  pwd:'123',
  userEmail:'231321341@qq.com',
  pwdQuestion:'你的工号',
  pwdAnswer:'1001'

}
function updateData(value: any) {
  Object.assign(curentuserinfo, value);
  return { msg: 'ok' };
}
export const curentuser = {
  '/curentuserinfo': curentuserinfo,
  'POST /curentuserinfo/update': (req: MockRequest) => updateData(req.body),

};
