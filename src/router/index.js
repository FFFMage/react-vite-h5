import Home from '@/container/Home'
import Data from '@/container/Data'
import User from '@/container/User'
import Detail from '@/container/Detail'
import Login from '@/container/Login'
import UserInfo from '@/container/UserInfo'
import Account from '@/container/Account'
import About from '@/container/About'
import Rank from '@/container/Rank'

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Home
  },
  {
    path: '/data',
    component: Data
  },
  {
    path: '/user',
    component: User
  },
  {
    path: '/detail/:id',
    component: Detail
  },
  {
    path: '/userinfo',
    component: UserInfo
  },
  {
    path: '/account',
    component: Account
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/rank',
    component: Rank
  }
]

export default routes