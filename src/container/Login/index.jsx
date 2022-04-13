import React, { useState, useCallback } from 'react'
import { Cell, Input, Button, Checkbox, Toast } from 'zarm'
import CustomIcon from '@/components/CustomIcon'
import Captcha from 'react-captcha-code'
import cls from 'classnames'
import { _register, _login } from '@/network/user'

import sty from './style.module.less'

export default function Login() {
  const [checked, setChecked] = useState(false) // 同意 复选框 状态
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [verify, setVerify] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [type, setType] = useState('login')

  // 复选框状态切换
  const checkChange = (e) => {
    setChecked(e.target.checked)
  }

  // 切换验证码
  const handleChange = useCallback((captcha) => {
    console.log('captcha', captcha)
    setCaptcha(captcha)
  }, [])

  // 切换登录注册 状态
  const changeLogin = (type) => {
    setUsername('')
    setPassword('')
    setVerify('')
    setType(type)
  }

  // 提交
  const onSubmit = async () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }
    try {
      // 判断是否为登录状态
      if (type === 'login') {
        // 获取token
        const { data } = await _login({
          username,
          password
        })
        Toast.show('登录成功')
        // 得到token存入 localstorage
        localStorage.setItem('token', data.token)
        // 跳转首页
        window.location.href = '/'
      } else {
        if (!verify) {
          Toast.show('请输入验证码')
          return
        }
        if (verify !== captcha) {
          Toast.show('验证码错误')
          return
        }
        if (!checked) {
          Toast.show('请阅读条款')
          return
        }
        await _register({
          username,
          password
        })
        Toast.show('注册成功')
      }
      // 注册成功后 清空输入框状态 切换为登录
      setUsername('')
      setPassword('')
      setVerify('')
      setType('login')
    } catch (error) {
      console.log(error)
      Toast.show(error.msg)
    }
  }

  return (
    <div className={sty.auth}>
      <div className={sty.head} />
      <div className={sty.tab}>
        <span className={cls({ [sty.active]: type === 'login' })} onClick={e => changeLogin('login')}>登录</span>
        <span className={type === 'register' ? `${sty.active}` : ''} onClick={e => changeLogin('register')}>注册</span>
      </div>
      <div className={sty.form}>
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={value => setUsername(value)}
            value={username}
          />
        </Cell>
        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={value => setPassword(value)}
            value={password}
          />
        </Cell>
        { type === 'register' ? <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入验证码"
            onChange={value => setVerify(value)}
            value={verify}
          />
          <Captcha charNum={4} onChange={handleChange} />
        </Cell> : null}
      </div>
      <div className={sty.operation}>
        { type === 'register' ? <div className={sty.agree}>
          <Checkbox checked={checked} onClick={checkChange} id="reg-chk" />
          <label htmlFor="reg-chk" className="text-light">阅读并同意<a>《记账本条款》</a></label>
        </div> : null}
        <Button block theme="primary" onClick={onSubmit}>{ type === 'register' ? '注册' : '登录'}</Button>
      </div>
    </div>
  )
}
