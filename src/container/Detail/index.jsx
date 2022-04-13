import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { Modal, Toast } from 'zarm'
import Header from '@/components/Header'
import CustomIcon from '@/components/CustomIcon'
import PopupAddBill from '@/components/PopupAddBill'

import { _getDetail, _delDetail } from '@/network/bill'
import { typeMap } from '@/utils'
import cls from 'classnames'
import dayjs from 'dayjs'

import sty from './style.module.less'

export default function Detail() {
  const editRef = useRef()
  const history = useHistory()
  const { id } = useParams() // 获取账单详情id
  const [detail, setDetail] = useState({}) //账单详情初始化

  useEffect(() => {
    getDetail()
  }, [])

  // 获取账单详情信息
  const getDetail = async() => {
    const { data } = await _getDetail({id})
    setDetail({ ...data, amount: data.amount.toFixed(2)})
  }

  // 删除方法
  const deleteDetail = () => {
    Modal.confirm({
      title: '删除',
      content: '确认删除账单?',
      onOk: async() => {
        const { data } = await _delDetail({id})
        Toast.show('删除成功!')
        history.push('/data')
      }
    })
  }

  return (
    <div className={sty.detail}>
      <Header title="账单详情" />
      <div className={sty.card}>
        <div className={sty.type}>
          {/* 通过 pay_type 属性，判断是收入或指出，给出不同的颜色*/}
          <span className={cls({[sty.expense]: detail.pay_type === 1, [sty.income]: detail.pay_type === 2})}>
            <CustomIcon className={sty.iconfont} type={detail.type_id ? typeMap[detail.type_id].icon : 1} />
          </span>
          <span>{detail.type_name || ''}</span>
        </div>
        {
          detail.pay_type === 1
          ? <div className={cls(sty.amount, sty.expense)}>-{detail.amount}</div>
          : <div className={cls(sty.amount, sty.income)}>+{detail.amount}</div>
        }
        <div className={sty.info}>
          <div className={sty.time}>
            <span>账单时间</span>
            <span>{dayjs(detail.date).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className={sty.remark}>
            <span>备注</span>
            <span>{detail.remark || '-'}</span>
          </div>
        </div>
        <div className={sty.operation}>
          <span onClick={deleteDetail}><CustomIcon type="shanchu" />删除</span>
          <span onClick={() => editRef.current && editRef.current.show()}><CustomIcon type="tianjia" />编辑</span>
        </div>
      </div>
      <PopupAddBill ref={editRef} detail={detail} onReload={getDetail} />
    </div>
  )
}
