import React, { useState, useEffect, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Popup, Icon } from 'zarm'
import cls from 'classnames'
import { _getTypeList } from '@/network/bill'

import sty from './style.module.less'

// forwardRef 用于拿到父组件传入的 ref 属性 这样在父组件便能通过 ref 控制子组件
const PopupType = forwardRef(({ onSelect }, ref) => {
  const [show, setShow] = useState(false) // 组件的显示和隐藏
  const [active, setActive] = useState('all') // 激活的type
  const [expense, setExpense] = useState([]) // 支出类型标签
  const [income, setIncome] = useState([]) // 收入类型标签

  useEffect(async () => {
    const { data } = await _getTypeList('/type/list')
    const { result: list } = data
    setExpense(list.filter(i => i.type === 1))
    setIncome(list.filter(i => i.type === 2))
  }, [])

  // 外部可以通过 ref.current.show 或 close 来控制组件的显示
  if (ref) {
    ref.current = {
      show() {
        setShow(true)
      },
      close() {
        setShow(false)
      }
    }
  }

  // 选择类型回调
  const choseType = (item) => {
    setActive(item.id)
    setShow(false)
    // 父组件传入的 onSelect，为了获取类型
    onSelect(item)
  }

  return (
    <Popup
      visible={show}
      direction='bottom'
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={sty.popupType}>
        <div className={sty.header}>
          请选择类型
          <Icon type="wrong" className={sty.cross} onClick={() => setShow(false)} />
        </div>
        <div className={sty.content}>
          <div 
            onClick={() => choseType({id: 'all'})} 
            className={cls({[sty.all]: true, [sty.active]: active === 'all'})}>
            全部类型
          </div>
          <div className={sty.title}>支出</div>
          <div className={sty.wrapExpense}>
            {
              expense.map((item, index) => (
                <p key={index} 
                  onClick={() => choseType(item)}
                  className={cls({[sty.active]: active === item.id})}
                  >
                    { item.name }
                </p>
              ))
            }
          </div>
          <div className={sty.title}>收入</div>
          <div className={sty.wrapIncome}>
            {
              income.map((item, index) => (
                <p key={index}
                  onClick={() => choseType(item)}
                  className={cls({[sty.active]: active === item.id})}
                >
                  { item.name }
                </p>
              ))
            }
          </div>
        </div>
      </div>
    </Popup>
  )
})

PopupType.propTypes = {
  onSelect: PropTypes.func
}

export default PopupType
