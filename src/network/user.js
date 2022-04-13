import { request } from './request'

// 用户登录
export function _login(params) {
  return request(
    {
      url: '/user/login',
      method: 'post',
      data: params
    }
  )
}

// 用户注册
export function _register(params) {
  return request(
    {
      url: '/user/register',
      method: 'post',
      data: params
    }
  )
}

// 获取用户信息
export function _getUserInfo() {
  return request(
    {
      url: '/user/get_userinfo',
      method: 'post'
    }
  )
}

// 修改用户密码
export function _modifyPassword(params) {
  return request(
    {
      url: '/user/modify_password',
      method: 'post',
      data: params
    }
  )
}

// 上传图片
export function _upload(params) {
  return request(
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      url: '/upload',
      method: 'post',
      data: params
    }
  )
}

// 修改用户信息
export function _editUserInfo(params) {
  return request(
    {
      url: '/user/edit_userinfo',
      method: 'post',
      data: params
    }
  )
}