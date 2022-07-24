import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { Icon, Progress } from 'zarm'

import CustomIcon from '@/components/CustomIcon'
import PopupDate from '@/components/PopupDate'

import cls from 'classnames'
import dayjs from 'dayjs'
import { _getData } from '@/network/bill'
import { typeMap } from '@/utils'

import sty from './style.module.less'

let proportionChart = null; // 用于存放 echart 初始化返回的实例

export default function Data() {
  const history = useHistory()
  const monthRef = useRef()
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'))
  const [totalType, setTotalType] = useState('expense') // 收入支出总类型
  const [totalExpense, setTotalExpense] = useState(0) // 总支出
  const [totalIncome, setTotalIncome] = useState(0) // 总收入
  const [expenseData, setExpenseData] = useState([]) // 支出数据
  const [incomeData, setIncomeData] = useState([]) // 收入数据
  const [rankExpense, setRankExpense] = useState([]) // 排行支出数据
  const [rankIncome, setRankIncome] = useState([]) // 排行收入数组
  const [pieType, setPieType] = useState('expense') // 饼图 收入 支出 控制

  useEffect(() => {
    getData()
  }, [currentMonth])

  // 获取数据详情
  const getData = async () => {
    const { data } = await _getData({ currentMonth });
    // 总收支
    setTotalExpense(data.total_expense.toFixed(2))
    setTotalIncome(data.total_income.toFixed(2))
    // 排行支出收入 数据
    setRankExpense(data.expense_rank_data)
    setRankIncome(data.income_rank_data)
    // 过滤支出和收入
    // 过滤支出项 倒序排序
    data.total_data.forEach(item => {
      item.number = item.number.toFixed(2)
    })
    const expense_data = data.total_data.filter(item => 
      item.pay_type === 1
    ).sort((a, b) => b.number - a.number)
    // 过滤收入项 倒叙排序
    const income_data = data.total_data.filter(item =>
      item.pay_type === 2
    ).sort((a, b) => b.number - a.number)
    // 更新 过滤支出收入 总数据
    setExpenseData(expense_data)
    setIncomeData(income_data)
    // 饼图 传递收入 支出 数据
    setPieChart(pieType === 'expense' ? {data:expense_data, type: 'expense'} : {data:income_data, type: 'income'})
  }

  // 切换支出收入状态
  const changeTotalType = (type) => {
    setTotalType(type)
  }

  // 月份弹窗开关
  const monthShow = () => {
    monthRef.current && monthRef.current.show();
  }
  
  // 选择日期
  const selectMonth = (item) => {
    setCurrentMonth(item)
  }

  // 绘制饼图
  const setPieChart = ({data, type}) => {
    if (!data) data = []
    if (proportionChart != null && proportionChart != "" && proportionChart != undefined) {
      proportionChart.dispose() // 销毁
    }
    if (window.echarts) {
      // 初始化 挂载echarts
      proportionChart = window.echarts.init(document.getElementById('proportion'))
      // 配置项
      let option = {
        tooltip: {
          trigger: 'item', // 触发提示框条件
          formatter: '{a} <br />{b} : {c} ({d}%)', // 格式化
        },
        // 图例
        legend: {
          data: data.map(item => item.type_name)
        },
        series: {
          name: type === 'expense' ? '支出' : '收入', // 系列名称
          type: 'pie', // 图表类型
          radius: '55%', // 饼图缩放大小
          // 饼图 渲染数据
          data: data.map(item => {
            return {
              value: item.number,
              name: item.type_name
            }
          }),
          emphasis: { // 高亮扇区 样式
            itemStyle: {
              shadowBlur: 10, // 阴影大小
              shadowOffsetX: 0, // 阴影向上偏移距离
              shadowColor: 'rgba(0, 0, 0, 0.5)' // 阴影颜色
            }
          }
        }
      }
      // 使用配置项
      proportionChart.setOption(option)
    }
  }

  // 切换饼图收支类型
  const changePieType = (type) => {
    setPieType(type)
    // 重绘饼图
    setPieChart(type === 'expense' ? { data: expenseData, type: 'expense' } : { data: incomeData, type: 'income' })
  }

  // 跳转支出或收入排行
  const changeRank = (type) => {
    history.push('/rank', {
      currentMonth: dayjs(currentMonth).format('M'),
      curType: type === 'expense' ? 'expense' : 'income',
      data: type === 'expense' ? rankExpense : rankIncome,
      curTotalNumber: type === 'expense' ? totalExpense : totalIncome,
    })
  }
  return (
    <div className={sty.data}>
      <div className={sty.total}>
        <div className={sty.time} onClick={monthShow}>
          <span>{currentMonth}</span>
          <Icon className={sty.date} type="date" />
        </div>
        <div className={sty.title}>共支出</div>
        <div className={sty.expense}>¥{totalExpense}</div>
        <div className={sty.income}>共收入¥{totalIncome}</div>
      </div>
      <div className={sty.structure}>
        <div className={sty.head}>
          <span className={sty.title}>收支构成</span>
          <div className={sty.tab}>
            <span
              onClick={() => changeTotalType('expense')}
              className={cls({[sty.expense]: true, [sty.active]: totalType === 'expense'})}>
              支出
            </span>
            <span
              onClick={() => changeTotalType('income')}
              className={cls({[sty.income]: true, [sty.active]: totalType === 'income'})}>
              收入
            </span>
          </div>
        </div>
        <div className={sty.content}>
          {
            (totalType === 'expense' ? expenseData : incomeData).map(item =>
              <div key={item.type_id} className={sty.item}>
                <div className={sty.left}>
                  <div className={sty.type}>
                    <span className={cls({[sty.expense]: item.pay_type === 1,[sty.income]: item.pay_type === 2})}>
                      <CustomIcon type={item.type_id ? typeMap[item.type_id].icon : 1} />
                    </span>
                    <span className={sty.name}>{item.type_name}</span>
                  </div>
                  <div className={sty.progress}>¥{Number(item.number).toFixed(2) || 0}</div>
                </div>
                <div className={sty.right}>
                  <div className={sty.percent}>
                    <Progress
                      shape="line"
                      theme="primary"
                      percent={
                        (item.number / 
                        Number(totalType === 'expense' ? totalExpense : totalIncome) * 100)
                        .toFixed(2)}
                    />
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
      <div className={sty.structure}>
          <div className={sty.proportion}>
            <div className={sty.head}>
              <span className={sty.title}>收支构成</span>
              <div className={sty.tab}>
                <span
                  onClick={() => changePieType('expense')}
                  className={cls({ [sty.expense]: true, [sty.active]: pieType === 'expense'})}>
                  支出
                </span>
                <span
                  onClick={() => changePieType('income')}
                  className={cls({ [sty.income]: true, [sty.active]: pieType === 'income' })}>
                  收入
                </span>
              </div>
            </div>
            {/* 饼图挂载的dom节点 */}
            <div id="proportion"></div>
          </div>
      </div>
      <div className={sty.structure} style={{marginBottom: 0}}>
          <div className={sty.rank}>
            <div className={sty.head}>
            {dayjs(currentMonth).format('M')}月{pieType === 'expense' ? '支出' : '收入'}排行
            </div>
            <div className={sty.rankContent}>
              {
              (pieType === 'expense' ? rankExpense: rankIncome).map((item, index) => {
                  if (index<=9)
                  return (
                    <div key={index} className={sty.item} onClick={() => { history.push(`/detail/${item.id}`)}}>
                      <div className={sty.left}>
                        <span className={sty.rankNumber}>{index + 1}</span>
                        <div className={sty.leftContent}>
                          <CustomIcon className={[item.pay_type === 1 ? sty.expense : sty.income, sty.iconfont]} type={typeMap[item.type_id].icon} />
                          <div className={sty.leftContentText}>
                            <span>{item.type_name}</span>
                            <span>{item.remark}</span>
                          </div>
                        </div>
                      </div>
                      <div className={sty.right}>
                        <span>{item.pay_type === 1 ? '-' : '+'}{item.amount.toFixed(2)}</span>
                        <span>{dayjs(item.date).format('M月D日 H:mm')}</span>
                      </div>
                    </div>
                  )
                })
              }
            {(pieType === 'expense' ? rankExpense : rankIncome).length > 10 ? 
              <div className={sty.all} onClick={() => changeRank(pieType)}>全部排行<Icon type="arrow-right" /></div>
               : null}
            </div>
          </div>
      </div>
      <PopupDate ref={monthRef} onSelect={selectMonth} mode="month" />
    </div>
  )
}
