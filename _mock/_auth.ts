import { MockRequest } from '@delon/mock';


function loginService(params: any) {
  debugger;
    let ret = null;
    if (params.username == 'admin' && params.password == '888888') {
        ret = {
            access_token: '12345678',
            token_type: '',
            refresh_token: '',
            expires_in: '',
            scope: '',
            iat: '',
            jti: ''
        };
    } else {
        ret = {};
    }

    return ret;
}

export const AUTH = {
    'POST /auth/login': (req: MockRequest) => loginService(req.body)
};
