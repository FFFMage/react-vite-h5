import React, { useState, forwardRef, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Popup, Icon, Keyboard, Input, Toast } from 'zarm'
import cls from 'classnames'
import dayjs from 'dayjs'
import PopupDate from '../PopupDate'
import CustomIcon from '../CustomIcon'
import { _getTypeList, _editBill, _addBill } from '@/network/bill'
import { typeMap } from '@/utils'

import sty from './style.module.less'

const PopupAddBill = forwardRef(({ detail = {}, onReload }, ref) => {
  const id = detail && detail.id // 账单详情id
  const dateRef = useRef() // 时间组件
  const [date, setDate] = useState(new Date()) // 日期
  const [show, setShow] = useState(false) // 控制弹窗与隐藏
  const [payType, setPayType] = useState('expense') // 收入支出类型
  const [amount, setAmount] = useState('') // 金额初始化
  const [currentType, setCurrentType] = useState({}) // 初始化选择账单类型
  const [expense, setExpense] = useState([]) // 初始化支出数组
  const [income, setIncome] = useState([]) // 初始化收入数组
  const [remark, setRemark] = useState('') // 初始化备注
  const [showRemark, setShowRemark] = useState(false) // 备注输入框展示控制

  useEffect(() => {
    if (id) {
      setPayType(detail.pay_type === 1 ? 'expense' : 'income')
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name
      }),
      setRemark(detail.remark)
      setAmount(detail.amount)
      setDate(detail.date)
    }
  }, [detail])

  useEffect(async () => {
    const { data } = await _getTypeList('/type/list')
    const { result: list } = data
    const _expense = list.filter(item => item.type === 1) // 支出类型
    const _income = list.filter(item => item.type === 2) // 收入类型
    setExpense(_expense)
    setIncome(_income)
  // 没有 id 的情况下，说明是新建账单
    if (!id) {
      setCurrentType(_expense[0]) // 新建账单，类型默认是支出类型数组的第一项
    }
  }, [])

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true)
      },
      close: () => {
        setShow(false)
      }
    }
  };

  // 切换类型
  const changeType = (type) => {
    setPayType(type)
    setCurrentType(type === 'expense' ? expense[0] : income[0])
  }

  // 设置时间
  const selectDate = (val) => {
    setDate(val)
  }

  // 监听输入框
  const handleMoney = (value) => {
    value = String(value)
    console.log(value)
    // 点击键盘图标按钮时
    if (value === 'close') {
      setShow(false)
      return
    }
    // 点击删除时
    if (value === 'delete') {
      let _amount = amount.slice(0, amount.length - 1)
      setAmount(_amount)
      return
    }
    // 点击确认时
    if (value === 'ok') {
      addBill()
      return
    }
    // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加
    if (value === '.' && amount.includes('.')) return
    // 小数点后保留两位 当超过两位 则不相加 返回
    if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return
    // 相加
    setAmount(amount + value)
  }

  // 添加账单
  const addBill = async () => {
    if (!amount) {
      Toast.show('请输入具体金额')
      return
    }
    const params = {
      amount: Number(amount), // 金额
      type_id: currentType.id, // 标签id
      type_name: currentType.name, // 标签类型
      date: dayjs(date).format(), // 时间
      pay_type: payType === 'expense' ? 1 : 2, // 账单类型
      remark: remark || '' // 备注
    }
    if (id) {
      params.id = id
      const result = await _editBill(params)
      Toast.show('修改成功');
    } else {
      const result = await _addBill(params)
      // 重置数据
      setAmount('');
      setPayType('expense');
      setCurrentType(expense[0]);
      setDate(new Date());
      setRemark('');
      Toast.show('添加成功');
    }
    setShow(false);
    if (onReload) onReload();
  }
  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={sty.wrapAdd}>
        {/* 右上角关闭弹窗 */}
        <header className={sty.header}>
          <span className={sty.close} onClick={() => setShow(false)}><Icon type="wrong" /></span>
        </header>
        {/* [收入] 和 [支出] 类型切换 */}
        <div className={sty.filter}>
          <div className={sty.type}>
            <span 
              className={cls({[sty.expense]: true, [sty.active]: payType === 'expense'})} 
              onClick={() => changeType('expense')}>
              支出
            </span>
            <span
              className={cls({ [sty.income]: true, [sty.active]: payType === 'income' })}
              onClick={() => changeType('income')}>
              收入
            </span>
          </div>
          <div
            className={sty.time}
            onClick={() => dateRef.current && dateRef.current.show()}
          >
            {dayjs(date).format('MM-DD')}
            <Icon className={sty.arrow} type="arrow-bottom" />
          </div>
          <PopupDate ref={dateRef} onSelect={selectDate} />
        </div>
        <div className={sty.money}>
          <span className={sty.sufix}>¥</span>
          <span className={cls(sty.amount, sty.animation)}>{amount}</span>
        </div>
        <div className={sty.wrapType}>
          <div className={sty.bodyType}>
            {/* 通过 payType 判断，是展示收入账单类型，还是支出账单类型 */}
            {
              (payType === 'expense' ? expense : income).map(item => (
                <div onClick={() => setCurrentType(item)} key={item.id} className={sty.typeItem}>
                  {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
                  <span className={cls({ [sty.iconfontWrap]: true, [sty.expense]: payType === 'expense', [sty.income]: payType === 'income', [sty.active]: currentType.id === item.id })}>
                    <CustomIcon type={typeMap[item.id].icon} className={sty.iconfont} />
                  </span>
                  <span>{item.name}</span>
                </div>
              ))
            }
          </div>
        </div>
        <div className={sty.remark}>
          {
            showRemark ? <Input
              autoHeight
              showLength
              maxLength={50}
              type="text"
              rows={3}
              value={remark}
              placeholder="请输入备注信息"
              onChange={val => setRemark(val)}
              onBlur={() => setShowRemark(false)}
            /> : <span onClick={() => setShowRemark(true)}>{remark || '添加备注'}</span>
          }
        </div>
        <Keyboard type="price" onKeyClick={value => handleMoney(value)} />
      </div>
    </Popup>
  )
})

export default PopupAddBill