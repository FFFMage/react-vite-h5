import React from 'react'
import { Cell, Input, Button, Toast } from 'zarm'
import Header from '@/components/Header'
import { createForm } from 'rc-form'
import { _modifyPassword } from '@/network/user'
import { useHistory } from 'react-router-dom'

import sty from './style.module.less'

function Account(props) {
  const history = useHistory()
  // Account 通过 createForm 高阶组件包裹之后，可以在 props 中获取到 form 属性
  const { getFieldProps, getFieldError } = props.form

  // 提交修改方法
  const submit = () => {
    props.form.validateFields(async(error, value) => {
      // error为表单验证状态 true or false
      console.log(error , value)
      if (!error) {
        if (value.newpass !== value.repass) {
          Toast.show('两次密码输入不一致')
          return
        }
        const result = await _modifyPassword({
          ...value
        })
        if (result.code !== 200) {
          Toast.show(result.msg)
          return
        }
        Toast.show(result.msg)
        // 修改密码成功 跳转登录页面 清空token
        history.push('/login')
        localStorage.removeItem('token')
      }
    })
  }

  return (
    <>
      <Header title="重置密码" />
      <div className={sty.account}>
        <div className={sty.form}>
          <Cell title="原密码">
            <Input
              clearable
              type="password"
              placeholder="请输入原密码"
              {...getFieldProps('oldpass', { rules: [{ required: true }] })}
            />
          </Cell>
          <Cell title="新密码">
            <Input
              clearable
              type="password"
              placeholder="请输新密码"
              {...getFieldProps('newpass', { rules: [{ required: true }] })}
            />
          </Cell>
          <Cell title="确认密码">
            <Input
              clearable
              type="password"
              placeholder="请再次输入密码确认"
              {...getFieldProps('repass', { rules: [{ required: true }] })}
            />
          </Cell>
        </div>
        <Button className={sty.btn} block theme="primary" onClick={submit} >提交</Button>
      </div>
    </>
  )
}

export default createForm()(Account)
