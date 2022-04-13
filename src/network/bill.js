import { request } from './request'

// 获取月份账单数据
export function _getData({currentMonth}) {
  return request(
    {
      url: `/bill/data?date=${currentMonth}`,
      method: 'get'
    }
  )
}

// 获取所有账单列表
export function _getBillList({page, currentTime, currentSelect}) {
  return request(
    {
      url: `/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${currentSelect.id || 'all'}`,
      method: 'get'
    }
  )
}

// 获取账单所有类型
export function _getTypeList() {
  return request(
    {
      url: '/type/list',
      method: 'get'
    }
  )
}

// 获取日账单详情
export function _getDetail({ id }) {
  return request(
    {
      url: `/bill/detail?id=${id}`,
      method: 'get'
    }
  )
}

// 删除账单
export function _delDetail(params) {
  return request(
    {
      url: `/bill/delete`,
      method: 'post',
      data: params
    }
  )
}

// 编辑账单
export function _editBill(params) {
  return request(
    {
      url: '/bill/update',
      method: 'post',
      data: params
    }
  )
}

// 添加账单
export function _addBill(params) {
  return request(
    {
      url: '/bill/add',
      method: 'post',
      data: params
    }
  )
}