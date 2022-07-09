import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { Button, Cell } from 'zarm'
import { _getUserInfo } from '@/network/user'

import sty from './style.module.less'

export default function User() {
  const history = useHistory()
  const [user, setUser] = useState({}) // 初始化用户信息
  const [avatar, setAvatar] = useState('') // 初始化用户头像

  useEffect(async () => {
    const { data } = await _getUserInfo()
    setUser(data)
    setAvatar(data.avatar)
  }, [])

  // 退出登录
  const logout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  }

  return (
    <div className={sty.user}>
      <div className={sty.head}>
        <div className={sty.info}>
          <span>昵称：{user.username || '--'}</span>
          <span>
            <img
              style={{width: 30, height: 30, verticalAlign: '-10px'}}
              src="//124.220.24.244:7001/public/upload/20211108/1636341404143.png" alt="个签图标" />
            <b>{user.signature || '暂无个签'}</b>
          </span>
        </div>
        <img
          style={{width: 60, height: 60, borderRadius: 8}}
          className={sty.avatar}
          src={avatar || ''} alt="头像" />
      </div>
      <div className={sty.content}>
        <Cell
          hasArrow
          title="用户信息修改"
          onClick={() => history.push('/userinfo')}
          icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//124.220.24.244:7001/public/upload/20211108/1636341056822.png" />}
        />
        <Cell
          hasArrow
          title="重置密码"
          onClick={() => history.push('/account')}
          icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//124.220.24.244:7001/public/upload/20211108/1636341084992.png" />}
        />
        <Cell
          hasArrow
          title="关于我的"
          onClick={() => history.push('/about')}
          icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//124.220.24.244:7001/public/upload/20211108/1636341075720.png" />}
        />
      </div>
      <Button className={sty.logout} block theme="danger" onClick={logout}>退出登录</Button>
    </div>
  )
}
