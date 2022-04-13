import { useState, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'

import { ConfigProvider } from 'zarm';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';

import routes from '@/router'

import NavBar from '@/components/NavBar';

function App() {
  const location = useLocation() // 拿到location实例
  const { pathname } = location // 获取当前路径
  const needNav = ['/', '/data', '/user'] // 需要底部导航栏的路径
  const [showNav, setShowNav] = useState(false) // 是否展示导航栏
  const token = localStorage.getItem('token')
  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname]) // []内监听的值发生变化,便会执行上述函数

  if (!token && location.pathname !== '/login') {
    window.location.href = '/login'
  }

  return (
    <>
      <ConfigProvider primaryColor={'#007fff'} locale={zhCN}>
        <Switch>
          {
            routes.map(route => (
              <Route exact path={route.path} key={route.path}>
                <route.component />
              </Route>
              )
            )
          }
        </Switch>
      </ConfigProvider>
      <NavBar showNav={showNav} />
    </>
  )
}

export default App
