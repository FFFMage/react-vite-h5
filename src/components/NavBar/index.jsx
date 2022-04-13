import React , { useState } from 'react'
import PropTypes from 'prop-types'
import { TabBar } from 'zarm'
import { useHistory, useLocation } from 'react-router-dom'
import CustomIcon from '../CustomIcon'
import sty from './style.module.less'

export default function NavBar({ showNav }) {
  const [activeKey, setActiveKey] = useState(useLocation().pathname)
  const history = useHistory()

  const changeTab = (path) => {
    setActiveKey(path)
    history.push(path)
  }

  NavBar.propTypes = {
    showNav: PropTypes.bool
  }

  return (
    <div>
      <TabBar visible={showNav} className={sty.tab} activeKey={activeKey} onChange={changeTab}>
        <TabBar.Item itemKey="/" title="账单" icon={<CustomIcon type="zhangdan" />} />
        <TabBar.Item itemKey="/data" title="统计" icon={<CustomIcon type="tongji" />} />
        <TabBar.Item itemKey="/user" title="我的" icon={<CustomIcon type="wode" />} />
      </TabBar>
    </div>
  )
}
