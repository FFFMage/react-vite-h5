import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { Cell } from 'zarm'
import CustomIcon from '../CustomIcon'
import { typeMap } from '@/utils'
import dayjs from 'dayjs'

import sty from './style.module.less'

export default function BillItem({ bill }) {
  const [expense, setExpense] = useState(0) // 支出
  const [income, setIncome] = useState(0) // 收入
  const history = useHistory() // 创建路由实例

  // 当添加账单是 bill.bills长度发生变化,触发当日收支总和计算
  useEffect(() => {
    // 初始化将传入的bill内的bills数组数据项 过滤出总支出与总收入
    const _expense = bill.bills.reduce((pre, item) => {
      if (item.pay_type === 1) {
        return pre + Number(item.amount)
      }
      return pre
    }, 0)
    const _income = bill.bills.reduce((pre, item) => {
      if (item.pay_type === 2) {
        return pre + Number(item.amount)
      }
      return pre
    }, 0)
    setExpense(_expense)
    setIncome(_income)
  }, [bill.bills])

  // 跳转至详情页
  const goToDetail = (item) => {
    history.push(`/detail/${item.id}`)
  }

  return (
    <div className={sty.item}>
      <div className={sty.headerData}>
        <div className={sty.date}>{bill.date}</div>
        <div className={sty.money}>
          <span>
            <span className={sty.moneyIcon}>支</span>
            <span>¥{expense.toFixed(2)}</span>
          </span>
          <span>
            <span className={sty.moneyIcon}>收</span>
            <span>¥{income.toFixed(2)}</span>
          </span>
        </div>
      </div>
      {
        bill && bill.bills.map(item => (
          <Cell className={sty.bill}
            key={item.id}
            onClick={() => goToDetail(item)}
            title={
              <>
                <CustomIcon className={sty.itemIcon}
                  type={item.type_id ? typeMap[item.type_id].icon : 1}
                />
                <span>{item.type_name}</span>
              </>
            }
            description={
              <span style={{ color: item.pay_type === 2 ? 'red' : '#39be77' }}>
                {`${item.pay_type === 1 ? '-' : '+'}${item.amount.toFixed(2)}`}
              </span>
            }
            help={
              <div>
                {dayjs(item.date).format('HH:mm')}
                {item.remark?` | ${item.remark}`:''}
              </div>
            }
          >
          </Cell>
        ))
      }
    </div>
  )
}

BillItem.propTypes = {
  bill: PropTypes.object
}
