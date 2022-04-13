import React, { useState, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Popup, DatePicker } from 'zarm'
import dayjs from 'dayjs'

const PopupDate = forwardRef(({ onSelect, mode = 'date' }, ref) => {
  const [show, setShow] = useState(false)
  const [now, setNow] = useState(new Date())

  // 选择时间
  const choseMonth = (item) => {
    setNow(item)
    setShow(false)
    if (mode === 'month') {
      onSelect(dayjs(item).format('YYYY-MM'))
    } else if (mode === 'date') {
      onSelect(dayjs(item).format('YYYY-MM-DD'))
    }
  }

  // 给父组件获取到的子组件 添加控制子组件 显示方法
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

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div>
        <DatePicker
          visible={show}
          value={now}
          mode={mode}
          onOk={choseMonth}
          onCancel={() => setShow(false)}
        >
        </DatePicker>
      </div>
    </Popup>
  )
})

PopupDate.propTypes = {
  mode: PropTypes.string, // 日期模式 默认类型
  onSelect: PropTypes.func, // 选择日期后回调 默认类型
}

export default PopupDate
