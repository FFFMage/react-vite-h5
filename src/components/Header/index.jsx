import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { NavBar, Icon } from 'zarm'

import sty from './style.module.less'

export default function Header({ title = '' }) {
  const history = useHistory()
  return (
    <div className={sty.wrapHeader}>
      <div className={sty.block}>
        <NavBar
          className={sty.header}
          left={<Icon type="arrow-left" theme="primary" onClick={() => history.goBack()} />}
          title={title}
        />
      </div>
    </div>
  )
}

Header.propTypes = {
  title: PropTypes.string // 默认 标题类型
}
