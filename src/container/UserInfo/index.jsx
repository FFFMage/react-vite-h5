import React, { useState, useEffect } from 'react'
import { FilePicker, Button, Input, Toast } from 'zarm'
import { useHistory } from 'react-router-dom'
import Header from '@/components/Header'
import { _upload, _editUserInfo, _getUserInfo } from '@/network/user'

import sty from './style.module.less'

export default function UserInfo() {
  const history = useHistory()
  const [user, setUser] = useState({})
  const [avatar, setAvatar] = useState('')
  const [signature, setSignature] = useState('')

  useEffect(() => {
    getUserInfo()
  }, [])

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await _getUserInfo();
    setUser(data);
    setAvatar(data.avatar)
    setSignature(data.signature)
  };

  // 上传图片
  const handleSelect = async (file) => {
    console.log('file', file)
    if (file && file.file.size > 200 * 1024) {
      Toast.show('上传头像不能超过200KB!')
      return
    }
    let formData = new FormData()
    formData.append('file', file.file)
    let result = await _upload(formData)
    console.log(result.data)
    // 存储上传头像地址
    setAvatar(result.data)
  }

  // 编辑用户信息
  const save = async () => {
    const result = await _editUserInfo({
      signature,
      avatar
    })
    console.log(result)
    Toast.show('修改成功')
    // 成功后回到个人中心页面
    history.goBack()
  }

  return (
    <>
    <Header title="用户信息" />
    <div className={sty.userinfo}>
      <h1>个人资料</h1>
      <div className={sty.item}>
        <div className={sty.title}>头像</div>
        <div className={sty.avatar}>
          <img className={sty.avatarUrl} src={avatar} alt="头像" />
          <div className={sty.desc}>
            <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
            <FilePicker onChange={handleSelect} accept="image/*">
              <Button className={sty.upload} theme='primary' size='xs'>点击上传</Button>
            </FilePicker>
          </div>
        </div>
      </div>
      <div className={sty.item}>
        <div className={sty.title}>个性签名</div>
        <div className={sty.signature}>
          <Input
            clearable
            type="text"
            value={signature}
            placeholder="请输入个性签名"
            onChange={(value) => setSignature(value)}
          />
        </div>
      </div>
      <Button onClick={save} theme="primary" block style={{marginTop: 50}}>保存</Button>
    </div>
    </>
  )
}
