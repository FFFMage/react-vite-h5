import React, { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import Header from '@/components/Header'
import CustomIcon from '@/components/CustomIcon'
import cls from 'classnames'
import { typeMap } from '@/utils'
import dayjs from 'dayjs'

import sty from './style.module.less'

export default function Rank() {
  const location = useLocation()
  const history = useHistory()
  const { curType, currentMonth, data, curTotalNumber } = location.state
  const [orderType, setOrderType] = useState('money')
  const sort_data = [...data].sort((a, b) => dayjs(b.date) - dayjs(a.date))
  return (
    <>
      <Header title={`${currentMonth}月排行`}/>
      <div className={sty.wrapRank}>
        <div className={sty.wrapScroll}>
          <div className={sty.head}>
            <span>{currentMonth}月共{curType === 'expense'? '支出': '收入'}</span>
            <span>¥{curTotalNumber}</span>
          </div>
          <div className={sty.rankContent}>
            <div className={cls({ [sty.type]: true, [sty.expense]: curType === 'expense', [sty.income]: curType === 'income' })}>
              <span onClick={() => setOrderType('money')} className={cls({[sty.active]: orderType === 'money'})}>按金额</span>
              <span onClick={() => setOrderType('time')} className={cls({[sty.active]: orderType === 'time'})}>按时间</span>
            </div>
            {
              (orderType === 'money' ? data : sort_data).map(item => {
                return (
                  <div className={sty.item} key={item.id} onClick={() => history.push(`/detail/${item.id}`)} >
                    <CustomIcon className={cls({ [sty.iconfont]: true, [sty.expense]: curType === 'expense', [sty.income]: curType === 'income'})} type={typeMap[item.type_id].icon} />
                    <div className={sty.itemContent}>
                      <div className={sty.left}>
                        <span>{item.type_name}</span>
                        <span>{item.remark}</span>
                      </div>
                      <div className={sty.right}>
                        <span>{item.pay_type === 1 ? '-' : '+'}{item.amount.toFixed(2)}</span>
                        <span>{dayjs(item.date).format('M月D日 H:mm')}</span>
                      </div>
                    </div>
                  </div>)
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}
