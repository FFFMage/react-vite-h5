import React, { useState, useEffect, useRef } from 'react'
import BillItem from '@/components/BillItem'
import { Icon, Pull } from 'zarm'
import dayjs from 'dayjs'
import { _getBillList } from '@/network/bill'
import { REFRESH_STATE, LOAD_STATE } from '@/utils' // pull组件需要一些常量
import PopupType from '@/components/PopupType'
import PopupDate from '@/components/PopupDate'
import CustomIcon from '@/components/CustomIcon'
import PopupAddBill from '@/components/PopupAddBill'

import sty from './style.module.less'

export default function Home() {
  const typeRef = useRef() // 账单类型ref
  const monthRef = useRef() // 月份筛选ref
  const addRef = useRef() // 添加账单ref
  const [currentSelect, setCurrentSelect] = useState({}) // 当前筛选类型
  const [list, setList] = useState([]) // 账单列表
  const [page, setpage] = useState(1) // 分页
  const [totalPage, setTotalPage] = useState(0) // 分页总数
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM')) // 当前筛选时间
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.noraml) // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal) // 上拉加载状态
  const [totalExpense, setTotalExpense] = useState(0) // 总支出
  const [totalIncome, setTotalIncome] = useState(0) // 总收入

  useEffect(() => {
    getBillList() // 初始化列表
  }, [page, currentSelect, currentTime])

  // 获取账单方法
  const getBillList = async () => {
    const { data } = await _getBillList({
      page,
      currentTime,
      currentSelect
    })
    if (page === 1) {
      setList(data.list)
    } else {
      setList(list.concat(data.list))
    }
    setTotalExpense(data.totalExpense.toFixed(2))
    setTotalIncome(data.totalIncome.toFixed(2))
    setTotalPage(data.totalPage)
    // 上滑下拉加载状态
    setRefreshing(REFRESH_STATE.success)
    setLoading(LOAD_STATE.success)
  }

  // 请求列表刷新
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading)
    if (page !== 1) {
      setpage(1)
    } else {
      getBillList()
    }
  }

  // 上拉加载新数据
  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading)
      setpage(page+1)
    }
  }

  // 添加账单弹窗
  const toggle = () => {
    typeRef.current && typeRef.current.show()
  }

  // 月份筛选弹窗
  const monthToggle = () => {
    monthRef.current && monthRef.current.show()
  }

  // 筛选类型
  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading)
    // 触发刷新列表 重置分页为1
    setpage(1)
    setCurrentSelect(item)
  }

  // 筛选月份
  const monthSelect = (item) => {
    setRefreshing(REFRESH_STATE.loading)
    setpage(1)
    setCurrentTime(item)
  }

  // 添加账单
  const addToggle = () => {
    addRef.current && addRef.current.show()
  }

  return (
    <div className={sty.home}>
      <div className={sty.header}>
        <div className={sty.wrapData}>
          <span className={sty.expense}>总支出：<b>¥ {totalExpense}</b></span>
          <span className={sty.income}>总收入：<b>¥ {totalIncome}</b></span>
        </div>
        <div className={sty.wrapType}>
          <div className={sty.left} onClick={toggle}>
            <span className={sty.title}>{ currentSelect.name || '全部类型'}<Icon className={sty.arrow} type='arrow-bottom' /></span>
          </div>
          <div className={sty.right} onClick={monthToggle}>
            <span className={sty.time}>{currentTime}<Icon className={sty.arrow} type='arrow-bottom' /></span>
          </div>
        </div>
      </div>
      <div className={sty.wrapContent}>
        {
          list.length ? <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData
            }}
          >
            {
              list.map((item, index) => (
                <BillItem bill={item} key={index} />
              ))
            }
          </Pull> : null
        }
      </div>
      <PopupType ref={typeRef} onSelect={select} />
      <PopupDate ref={monthRef} onSelect={monthSelect} mode="month" />
      <div className={sty.add}><CustomIcon onClick={addToggle} type="tianjia" /></div>
      <PopupAddBill ref={addRef} onReload={refreshData} />
    </div>
  )
}
